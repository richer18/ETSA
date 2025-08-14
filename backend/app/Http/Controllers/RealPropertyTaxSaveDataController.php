<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RealPropertyTaxSaveDataController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->all();

        try {
            $id = DB::table('real_property_tax_data')->insertGetId([
                'date' => $data['date'],
                'name' => $data['name'],
                'receipt_no' => $data['receipt_no'],
                'current_year' => $data['current_year'],
                'current_penalties' => $data['current_penalties'],
                'current_discounts' => $data['current_discounts'],
                'prev_year' => $data['prev_year'],
                'prev_penalties' => $data['prev_penalties'],
                'prior_years' => $data['prior_years'],
                'prior_penalties' => $data['prior_penalties'],
                'total' => $data['total'],
                'barangay' => $data['barangay'],
                'share' => $data['share'],
                'additional_current_year' => $data['additional_current_year'],
                'additional_penalties' => $data['additional_penalties'],
                'additional_discounts' => $data['additional_discounts'],
                'additional_prev_year' => $data['additional_prev_year'],
                'additional_prev_penalties' => $data['additional_prev_penalties'],
                'additional_prior_years' => $data['additional_prior_years'],
                'additional_prior_penalties' => $data['additional_prior_penalties'],
                'additional_total' => $data['additional_total'],
                'gf_total' => $data['gf_total'],
                'status' => $data['status'],
                'advanced_payment' => $data['advanced_payment'],
                'cashier' => $data['cashier'],
            ]);

            return response()->json([
                'message' => 'Record inserted successfully',
                'id' => $id
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
