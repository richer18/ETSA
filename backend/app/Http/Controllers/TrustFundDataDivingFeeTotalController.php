<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class TrustFundDataDivingFeeTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Build query with optional filters
            $query = DB::table('trust_fund_data')
                ->selectRaw('SUM(LOCAL_40_PERCENT_DIVE_FEE + FISHERS_30_PERCENT + BRGY_30_PERCENT) AS Diving_Fee_Total');

            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $result = $query->first();

            return response()->json([
                'diving_fee_total' => $result->Diving_Fee_Total ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching diving fee total: ' . $e->getMessage());
            return response()->json(['error' => 'Database query failed'], 500);
        }
    }
}
