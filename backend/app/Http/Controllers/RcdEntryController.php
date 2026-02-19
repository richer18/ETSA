<?php

namespace App\Http\Controllers;

use App\Models\IssuedAccountableForm;
use App\Models\RcdEntry;
use App\Support\CollectorLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class RcdEntryController extends Controller
{
    private function normalizeDigitsString($value): ?string
    {
        if ($value === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', (string) $value);
        return $digits === '' ? null : $digits;
    }

    private function toInt($value): int
    {
        return (int) ltrim((string) $value, '0');
    }

    private function padReceipt(int $value, int $width): string
    {
        if ($value <= 0) {
            return '0';
        }

        return str_pad((string) $value, max(1, $width), '0', STR_PAD_LEFT);
    }

    public function index(Request $request)
    {
        $query = RcdEntry::query();

        if ($request->filled('month')) {
            $query->whereMonth('issued_date', (int) $request->month);
        }

        if ($request->filled('year')) {
            $query->whereYear('issued_date', (int) $request->year);
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search) {
                $q->where('collector', 'like', "%{$search}%")
                  ->orWhere('type_of_receipt', 'like', "%{$search}%")
                  ->orWhere('receipt_no_from', 'like', "%{$search}%")
                  ->orWhere('receipt_no_to', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderByDesc('issued_date')->orderByDesc('id')->get()
        );
    }

    public function store(Request $request)
    {
        $hasRcdSerialColumn = Schema::hasColumn('rcd_issued_form', 'serial_no');

        $payload = [
            'issued_date' => $request->input('issued_date', $request->input('Date')),
            'fund' => $request->input('fund', $request->input('Fund')),
            'collector' => $request->input('collector', $request->input('Collector')),
            'type_of_receipt' => $request->input('type_of_receipt', $request->input('Type_of_Receipt')),
            'serial_no' => $hasRcdSerialColumn ? $request->input('serial_no', $request->input('Serial_No')) : null,
            'receipt_no_from' => $this->normalizeDigitsString($request->input('receipt_no_from', $request->input('Receipt_No_From'))),
            'receipt_no_to' => $this->normalizeDigitsString($request->input('receipt_no_to', $request->input('Receipt_No_To'))),
            'total' => $request->input('total', $request->input('Total')),
            'status' => $request->input('status', $request->input('Status', 'Not Remit')),
        ];

        $validated = Validator::make($payload, [
            'issued_date' => 'required|date',
            'fund' => 'nullable|string|max:100',
            'collector' => 'required|string|max:100',
            'type_of_receipt' => 'required|string|max:50',
            'serial_no' => $hasRcdSerialColumn ? 'nullable|string|max:100' : 'nullable',
            'receipt_no_from' => 'required|string|regex:/^\d+$/',
            'receipt_no_to' => 'required|string|regex:/^\d+$/',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:Remit,Not Remit,Deposit,Approve,Purchase',
        ])->validate();

        if ($this->toInt($validated['receipt_no_to']) < $this->toInt($validated['receipt_no_from'])) {
            return response()->json([
                'message' => 'Receipt no. to must be greater than or equal to receipt no. from.',
            ], 422);
        }

        $hasDuplicate = RcdEntry::query()
            ->whereDate('issued_date', $validated['issued_date'])
            ->where('collector', $validated['collector'])
            ->when($hasRcdSerialColumn && !empty($validated['serial_no']), function ($query) use ($validated) {
                $query->where('serial_no', $validated['serial_no']);
            })
            ->exists();

        if ($hasDuplicate) {
            return response()->json([
                'message' => 'Entry already exists for this date, collector, and serial number.',
            ], 409);
        }

        return DB::transaction(function () use ($validated) {
            $entryData = $validated;
            if (!Schema::hasColumn('rcd_issued_form', 'fund')) {
                unset($entryData['fund']);
            }
            if (!Schema::hasColumn('rcd_issued_form', 'serial_no')) {
                unset($entryData['serial_no']);
            }
            $entry = RcdEntry::create($entryData);
            $entryDate = Carbon::parse($validated['issued_date'])->toDateString();
            $hasUsageBeforeDate = IssuedAccountableForm::query()
                ->where('Collector', $validated['collector'])
                ->where('Form_Type', $validated['type_of_receipt'])
                ->when(!empty($validated['serial_no']), function ($query) use ($validated) {
                    $query->where('Serial_No', $validated['serial_no']);
                })
                ->where('Status', 'ISSUED')
                ->whereDate('Date', '<', $entryDate)
                ->where('Issued_receipt_qty', '>', 0)
                ->exists();

            // Prefer the row for the same date (if exists).
            $issuedForm = IssuedAccountableForm::query()
                ->where('Collector', $validated['collector'])
                ->where('Form_Type', $validated['type_of_receipt'])
                ->when(!empty($validated['serial_no']), function ($query) use ($validated) {
                    $query->where('Serial_No', $validated['serial_no']);
                })
                ->where('Status', 'ISSUED')
                ->whereDate('Date', $entryDate)
                ->orderByDesc('ID')
                ->first();

            $flowMode = 'same_day';

            // If no same-date row exists:
            // - first usage flow: update latest assignment row directly
            // - next-day flow after prior usage: create a carry-over row
            if (!$issuedForm) {
                $previousIssuedForm = IssuedAccountableForm::query()
                    ->where('Collector', $validated['collector'])
                    ->where('Form_Type', $validated['type_of_receipt'])
                    ->when(!empty($validated['serial_no']), function ($query) use ($validated) {
                        $query->where('Serial_No', $validated['serial_no']);
                    })
                    ->where('Status', 'ISSUED')
                    ->whereDate('Date', '<=', $entryDate)
                    ->orderByDesc('Date')
                    ->orderByDesc('ID')
                    ->first();

                if (!$previousIssuedForm) {
                    abort(response()->json([
                        'message' => 'No assigned accountable form found for this collector and receipt type.',
                    ], 404));
                }

                $carryQty = (int) ($previousIssuedForm->Stock ?? 0);
                if ($carryQty <= 0) {
                    abort(response()->json([
                        'message' => 'No available stock to carry over for this collector and receipt type.',
                    ], 422));
                }

                if (!$hasUsageBeforeDate) {
                    // First usage for this collector/type: update the assignment row itself.
                    $flowMode = 'first_use_existing_assignment';
                    $issuedForm = $previousIssuedForm;
                } else {
                    $flowMode = 'carry_over_new_row';
                    $prevEndingFromRaw = (string) ($previousIssuedForm->Ending_Balance_receipt_from ?? '0');
                    $prevEndingToRaw = (string) ($previousIssuedForm->Ending_Balance_receipt_to ?? '0');
                    $prevRangeFromRaw = (string) ($previousIssuedForm->Receipt_Range_From ?? '0');
                    $prevRangeToRaw = (string) ($previousIssuedForm->Receipt_Range_To ?? '0');

                    $prevEndingFrom = $this->toInt($prevEndingFromRaw);
                    $prevEndingTo = $this->toInt($prevEndingToRaw);
                    $prevRangeFrom = $this->toInt($prevRangeFromRaw);
                    $prevRangeTo = $this->toInt($prevRangeToRaw);

                    $carryFromRaw = ($prevEndingFrom > 0 && $prevEndingTo >= $prevEndingFrom)
                        ? $prevEndingFromRaw
                        : $prevRangeFromRaw;
                    $carryToRaw = ($prevEndingTo > 0 && $prevEndingTo >= $this->toInt($carryFromRaw))
                        ? $prevEndingToRaw
                        : $prevRangeToRaw;

                    $issuedForm = IssuedAccountableForm::create([
                        'Date' => $entryDate,
                        'Fund' => $validated['fund'] ?? $previousIssuedForm->Fund ?? '100 General Fund',
                        'Collector' => $previousIssuedForm->Collector,
                        'Form_Type' => $previousIssuedForm->Form_Type,
                        'Serial_No' => $previousIssuedForm->Serial_No,
                        // Next-day row should keep receipt range fields as zero.
                        'Receipt_Range_qty' => 0,
                        'Receipt_Range_From' => 0,
                        'Receipt_Range_To' => 0,
                        'Begginning_Balance_receipt_qty' => $carryQty,
                        'Begginning_Balance_receipt_from' => $carryFromRaw,
                        'Begginning_Balance_receipt_to' => $carryToRaw,
                        'Ending_Balance_receipt_qty' => $carryQty,
                        'Ending_Balance_receipt_from' => $carryFromRaw,
                        'Ending_Balance_receipt_to' => $carryToRaw,
                        'Issued_receipt_qty' => 0,
                        'Issued_receipt_from' => 0,
                        'Issued_receipt_to' => 0,
                        'Stock' => $carryQty,
                        'Date_Issued' => $previousIssuedForm->Date_Issued ?? now(),
                        'Status' => 'ISSUED',
                    ]);
                }
            }


            $fromRaw = (string) $validated['receipt_no_from'];
            $toRaw = (string) $validated['receipt_no_to'];
            $from = $this->toInt($fromRaw);
            $to = $this->toInt($toRaw);
            $issuedQty = ($to - $from) + 1;

            $currentStock = (int) ($issuedForm->Stock ?? 0);

            $endingFromRaw = (string) ($issuedForm->Ending_Balance_receipt_from ?? '0');
            $endingToRaw = (string) ($issuedForm->Ending_Balance_receipt_to ?? '0');
            $endingFrom = $this->toInt($endingFromRaw);
            $endingTo = $this->toInt($endingToRaw);
            $hasValidEndingRange = $endingFrom > 0 && $endingTo >= $endingFrom;
            $beginFromRaw = (string) ($issuedForm->Begginning_Balance_receipt_from ?? '0');
            $beginToRaw = (string) ($issuedForm->Begginning_Balance_receipt_to ?? '0');
            $beginFrom = $this->toInt($beginFromRaw);
            $beginTo = $this->toInt($beginToRaw);
            $hasValidBeginningRange = $beginFrom > 0 && $beginTo >= $beginFrom;
            $rangeFromRaw = (string) ($issuedForm->Receipt_Range_From ?? '0');
            $rangeToRaw = (string) ($issuedForm->Receipt_Range_To ?? '0');
            $rangeFrom = $this->toInt($rangeFromRaw);
            $rangeTo = $this->toInt($rangeToRaw);

            $balanceFrom = $hasValidEndingRange
                ? $endingFrom
                : ($hasValidBeginningRange ? $beginFrom : $rangeFrom);
            $balanceTo = $hasValidEndingRange
                ? $endingTo
                : ($hasValidBeginningRange ? $beginTo : $rangeTo);

            if ($from < $balanceFrom || $to > $balanceTo) {
                abort(response()->json([
                    'message' => 'Receipt range is outside the current assigned balance range.',
                ], 422));
            }

            if ($issuedQty > $currentStock) {
                abort(response()->json([
                    'message' => 'Issued quantity exceeds available stock for this assignment.',
                ], 422));
            }

            $endingQty = $currentStock - $issuedQty;
            $seriesWidth = max(
                strlen($fromRaw),
                strlen($toRaw),
                strlen($rangeFromRaw),
                strlen($rangeToRaw),
                strlen($beginFromRaw),
                strlen($beginToRaw),
                strlen($endingFromRaw),
                strlen($endingToRaw)
            );
            $newEndingFrom = $endingQty > 0 ? $to + 1 : 0;
            $newEndingTo = $endingQty > 0 ? $balanceTo : 0;
            $issuedFromFormatted = $this->padReceipt($from, $seriesWidth);
            $issuedToFormatted = $this->padReceipt($to, $seriesWidth);
            $newEndingFromFormatted = $endingQty > 0 ? $this->padReceipt($newEndingFrom, $seriesWidth) : '0';
            $newEndingToFormatted = $endingQty > 0 ? $this->padReceipt($newEndingTo, $seriesWidth) : '0';

            $issuedFormUpdateData = [
                'Ending_Balance_receipt_qty' => $endingQty,
                'Ending_Balance_receipt_from' => $newEndingFromFormatted,
                'Ending_Balance_receipt_to' => $newEndingToFormatted,
                'Issued_receipt_qty' => $issuedQty,
                'Issued_receipt_from' => $issuedFromFormatted,
                'Issued_receipt_to' => $issuedToFormatted,
                'Stock' => $endingQty,
            ];
            if (Schema::hasColumn('issued_accountable_forms', 'Fund')) {
                $issuedFormUpdateData['Fund'] = $validated['fund'] ?? null;
            }
            DB::table('issued_accountable_forms')
                ->where('ID', $issuedForm->ID)
                ->update($issuedFormUpdateData);

            $updatedIssuedForm = DB::table('issued_accountable_forms')
                ->where('ID', $issuedForm->ID)
                ->first();

            CollectorLogger::write($validated['collector'], 'rcd_entry_saved', [
                'entry_id' => $entry->id,
                'issued_form_id' => $issuedForm->ID,
                'flow_mode' => $flowMode,
                'entry_date' => $entryDate,
                'type_of_receipt' => $validated['type_of_receipt'],
                'issued_from' => $from,
                'issued_to' => $to,
                'issued_qty' => $issuedQty,
                'ending_qty' => $endingQty,
                'ending_from' => $newEndingFrom,
                'ending_to' => $newEndingTo,
                'stock' => $endingQty,
            ]);

            return response()->json([
                'message' => 'Entry saved successfully.',
                'entry' => $entry,
                'issued_form' => $updatedIssuedForm,
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $entry = RcdEntry::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found.'], 404);
        }
        $hasRcdSerialColumn = Schema::hasColumn('rcd_issued_form', 'serial_no');

        $payload = [
            'issued_date' => $request->input('issued_date', $request->input('Date', $entry->issued_date)),
            'fund' => $request->input('fund', $request->input('Fund', $entry->fund)),
            'collector' => $request->input('collector', $request->input('Collector', $entry->collector)),
            'type_of_receipt' => $request->input('type_of_receipt', $request->input('Type_of_Receipt', $entry->type_of_receipt)),
            'serial_no' => $hasRcdSerialColumn ? $request->input('serial_no', $request->input('Serial_No', $entry->serial_no)) : null,
            'receipt_no_from' => $this->normalizeDigitsString($request->input('receipt_no_from', $request->input('Receipt_No_From', $entry->receipt_no_from))),
            'receipt_no_to' => $this->normalizeDigitsString($request->input('receipt_no_to', $request->input('Receipt_No_To', $entry->receipt_no_to))),
            'total' => $request->input('total', $request->input('Total', $entry->total)),
            'status' => $request->input('status', $request->input('Status', $entry->status ?? 'Not Remit')),
        ];

        $validated = Validator::make($payload, [
            'issued_date' => 'required|date',
            'fund' => 'nullable|string|max:100',
            'collector' => 'required|string|max:100',
            'type_of_receipt' => 'required|string|max:50',
            'serial_no' => $hasRcdSerialColumn ? 'nullable|string|max:100' : 'nullable',
            'receipt_no_from' => 'required|string|regex:/^\d+$/',
            'receipt_no_to' => 'required|string|regex:/^\d+$/',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:Remit,Not Remit,Deposit,Approve,Purchase',
        ])->validate();

        if ($this->toInt($validated['receipt_no_to']) < $this->toInt($validated['receipt_no_from'])) {
            return response()->json([
                'message' => 'Receipt no. to must be greater than or equal to receipt no. from.',
            ], 422);
        }

        $updateData = $validated;
        if (!Schema::hasColumn('rcd_issued_form', 'fund')) {
            unset($updateData['fund']);
        }
        if (!Schema::hasColumn('rcd_issued_form', 'serial_no')) {
            unset($updateData['serial_no']);
        }
        $entry->update($updateData);

        CollectorLogger::write($validated['collector'], 'rcd_entry_updated', [
            'entry_id' => $entry->id,
            'issued_date' => $validated['issued_date'],
            'type_of_receipt' => $validated['type_of_receipt'],
            'serial_no' => $validated['serial_no'] ?? '',
            'receipt_no_from' => $validated['receipt_no_from'],
            'receipt_no_to' => $validated['receipt_no_to'],
            'total' => $validated['total'],
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Entry updated successfully.',
            'entry' => $entry->fresh(),
        ]);
    }
}
