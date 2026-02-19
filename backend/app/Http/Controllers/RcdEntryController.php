<?php

namespace App\Http\Controllers;

use App\Models\IssuedAccountableForm;
use App\Models\RcdEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RcdEntryController extends Controller
{
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
        $payload = [
            'issued_date' => $request->input('issued_date', $request->input('Date')),
            'collector' => $request->input('collector', $request->input('Collector')),
            'type_of_receipt' => $request->input('type_of_receipt', $request->input('Type_of_Receipt')),
            'receipt_no_from' => $request->input('receipt_no_from', $request->input('Receipt_No_From')),
            'receipt_no_to' => $request->input('receipt_no_to', $request->input('Receipt_No_To')),
            'total' => $request->input('total', $request->input('Total')),
            'status' => $request->input('status', $request->input('Status', 'Not Remit')),
        ];

        $validated = Validator::make($payload, [
            'issued_date' => 'required|date',
            'collector' => 'required|string|max:100',
            'type_of_receipt' => 'required|string|max:50',
            'receipt_no_from' => 'required|integer|min:1',
            'receipt_no_to' => 'required|integer|gte:receipt_no_from',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:Remit,Not Remit,Deposit,Approve,Purchase',
        ])->validate();

        return DB::transaction(function () use ($validated) {
            $entry = RcdEntry::create($validated);

            $issuedForm = IssuedAccountableForm::query()
                ->where('Collector', $validated['collector'])
                ->where('Form_Type', $validated['type_of_receipt'])
                ->where('Status', 'ISSUED')
                ->orderByDesc('Date_Issued')
                ->first();

            if (!$issuedForm) {
                abort(response()->json([
                    'message' => 'No assigned accountable form found for this collector and receipt type.',
                ], 404));
            }

            $from = (int) $validated['receipt_no_from'];
            $to = (int) $validated['receipt_no_to'];
            $issuedQty = ($to - $from) + 1;

            $currentStock = (int) ($issuedForm->Stock ?? 0);

            $endingFrom = (int) ($issuedForm->Ending_Balance_receipt_from ?? 0);
            $endingTo = (int) ($issuedForm->Ending_Balance_receipt_to ?? 0);
            $hasValidEndingRange = $endingFrom > 0 && $endingTo >= $endingFrom;

            $balanceFrom = $hasValidEndingRange
                ? $endingFrom
                : (int) ($issuedForm->Begginning_Balance_receipt_from
                    ?? $issuedForm->Receipt_Range_From
                    ?? 0);
            $balanceTo = $hasValidEndingRange
                ? $endingTo
                : (int) ($issuedForm->Begginning_Balance_receipt_to
                    ?? $issuedForm->Receipt_Range_To
                    ?? 0);

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
            $newEndingFrom = $endingQty > 0 ? $to + 1 : null;
            $newEndingTo = $endingQty > 0 ? $balanceTo : null;

            DB::table('issued_accountable_forms')
                ->where('ID', $issuedForm->ID)
                ->update([
                    'Receipt_Range_qty' => $endingQty,
                    'Ending_Balance_receipt_qty' => $endingQty,
                    'Ending_Balance_receipt_from' => $newEndingFrom,
                    'Ending_Balance_receipt_to' => $newEndingTo,
                    'Issued_receipt_qty' => $issuedQty,
                    'Issued_receipt_from' => $from,
                    'Issued_receipt_to' => $to,
                    'Stock' => $endingQty,
                    // Keep the current working range in sync with remaining balance.
                    'Receipt_Range_From' => $newEndingFrom,
                    'Receipt_Range_To' => $newEndingTo,
                ]);

            $updatedIssuedForm = DB::table('issued_accountable_forms')
                ->where('ID', $issuedForm->ID)
                ->first();

            return response()->json([
                'message' => 'Entry saved successfully.',
                'entry' => $entry,
                'issued_form' => $updatedIssuedForm,
            ], 201);
        });
    }
}
