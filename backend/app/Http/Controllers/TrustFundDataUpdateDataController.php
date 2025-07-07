<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrustFundDataUpdateDataController extends Controller
{
    public function update(Request $request, $id)
    {
        // List of fields allowed to be updated
        $allowedFields = [
            'DATE',
            'NAME',
            'RECEIPT_NO',
            'CASHIER',
            'TYPE_OF_RECEIPT',
            'BUILDING_PERMIT_FEE',
            'LOCAL_80_PERCENT',
            'TRUST_FUND_15_PERCENT',
            'NATIONAL_5_PERCENT',
            'LIVESTOCK_DEV_FUND',
            'LOCAL_80_PERCENT_LIVESTOCK',
            'NATIONAL_20_PERCENT',
            'DIVING_FEE',
            'LOCAL_40_PERCENT_DIVE_FEE',
            'FISHERS_30_PERCENT',
            'BRGY_30_PERCENT',
            'ELECTRICAL_FEE',
            'ZONING_FEE',
        ];

        $updateData = [];

        // Only include valid fields from request
        foreach ($allowedFields as $field) {
            if ($request->has($field)) {
                $updateData[$field] = $request->input($field);
            }
        }

        if (empty($updateData)) {
            return response()->json([
                'message' => 'No valid fields provided for update.'
            ], 400);
        }

        try {
            // Execute update
            DB::table('trust_fund_data')
                ->where('ID', $id)
                ->update($updateData);

            return response()->json([
                'message' => 'Trust fund updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update trust fund.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
