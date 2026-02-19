<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class TrustFundDataElectricalFeeTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Start the query
            $query = DB::table('trust_fund_data')
                ->selectRaw('SUM(ELECTRICAL_FEE) AS Electrical_Fee_Total');

            // Add optional date filters
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            // Execute query
            $result = $query->first();

            return response()->json([
                'electrical_fee_total' => $result->Electrical_Fee_Total ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching electrical fee total: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
