<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class TrustFundDataBuildingPermitFeeTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Build base query
            $query = DB::table('trust_fund_data')
                ->selectRaw('SUM(LOCAL_80_PERCENT + TRUST_FUND_15_PERCENT + NATIONAL_5_PERCENT) AS Building_Permit_Fee_Total');

            // Apply date filters if present
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $result = $query->first();

            return response()->json([
                'building_permit_fee_total' => $result->Building_Permit_Fee_Total ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching Building Permit Fee total: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data.'], 500);
        }
    }
}
