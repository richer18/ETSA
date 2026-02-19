<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IssuedAccountableForm;
use App\Models\PurchaseAccountableForm;

class AssignFormController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'Date' => 'required|date',
                'Collector' => 'required|string',
                'Form_Type' => 'required|string',
                'Serial_No' => 'required|string',
                'Receipt_Range_From' => 'required|integer',
                'Receipt_Range_To' => 'required|integer',
                'Issued_receipt_qty' => 'required|integer',
            ]);

            // Save to Issued_Accountable_Forms
            $issuedForm = IssuedAccountableForm::create([
                'Date' => $request->Date,
                'Collector' => $request->Collector,
                'Form_Type' => $request->Form_Type,
                'Serial_No' => $request->Serial_No,
                'Receipt_Range_qty' => $request->Stock,
                'Receipt_Range_From' => $request->Receipt_Range_From,
                'Receipt_Range_To' => $request->Receipt_Range_To,
                'Begginning_Balance_receipt_qty' => $request->Stock,
                'Begginning_Balance_receipt_from' => $request->Receipt_Range_From,
                'Begginning_Balance_receipt_to' => $request->Receipt_Range_To,
                'Stock' => $request->Stock,
                'Date_Issued' => now(),
                'Status' => 'ISSUED',
            ]);

            // Update inventory to USED
            $inventory = PurchaseAccountableForm::where('serial_no', $request->Serial_No)->first();
            if ($inventory) {
                $inventory->status = 'USED';
                $inventory->save();
            }

            return response()->json([
                'success' => true,
                'issued_form' => $issuedForm
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
