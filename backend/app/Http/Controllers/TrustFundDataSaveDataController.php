<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataSaveDataController extends Controller
{
    public function store(Request $request)
    {
        // ❗ TOTAL is a STORED GENERATED column — must not be inserted
        $data = $request->except(['TOTAL']);

        // 1. Check if RECEIPT_NO already exists
        $exists = DB::table('trust_fund_data')
            ->where('RECEIPT_NO', $data['RECEIPT_NO'])
            ->exists();

        if ($exists) {
            return response("Receipt number already exists", 400);
        }

        try {
            // 2. Insert the record — MySQL will calculate TOTAL
            DB::table('trust_fund_data')->insert($data);
            return response("Data saved successfully", 200);
        } catch (\Exception $e) {
            Log::error("Error saving trust fund data", [
                'message' => $e->getMessage(),
                'payload' => $data
            ]);
            return response("Error saving data", 500);
        }
    }
}
