<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseAccountableForm;

class PurchaseController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'purchase_date' => 'required|date',
            'form_type' => 'required|string',
            'serial_no' => 'required|string',
            'receipt_range_from' => 'required|integer',
            'receipt_range_to' => 'required|integer|gte:receipt_range_from',
            'stock' => 'required|integer',
            'status' => 'required|in:AVAILABLE,USED,CANCELLED',
        ]);

        $purchase = PurchaseAccountableForm::create([
            'purchase_date' => $request->purchase_date,
            'Form_Type' => $request->form_type,
            'Serial_No' => $request->serial_no,
            'Receipt_Range_From' => $request->receipt_range_from,
            'Receipt_Range_To' => $request->receipt_range_to,
            'Stock' => $request->stock,
            'Status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Purchase saved successfully',
            'purchase' => $purchase
        ], 201);
    }

    public function index()
{
    // Fetch all purchases ordered by date descending
    $purchases = \App\Models\PurchaseAccountableForm::orderBy('purchase_date', 'desc')->get();

    return response()->json($purchases);
}

public function availableForms()
{
    $forms = \App\Models\PurchaseAccountableForm::where('status', 'AVAILABLE')->get();
    return response()->json($forms);
}

public function updateStatus($serial, Request $request)
{
    $form = \App\Models\PurchaseAccountableForm::where('Serial_No', $serial)->first();
    if ($form) {
        $form->Status = $request->Status;
        $form->save();
        return response()->json(['success' => true]);
    }
    return response()->json(['success' => false], 404);
}
}
