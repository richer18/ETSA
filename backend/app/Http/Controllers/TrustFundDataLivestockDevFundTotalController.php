<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class TrustFundDataLivestockDevFundTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('trust_fund_data')
                ->selectRaw('SUM(LOCAL_80_PERCENT_LIVESTOCK + NATIONAL_20_PERCENT) AS Livestock_Dev_Fund_Total');

            // Apply optional filters (month, day, year)
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $result = $query->first();

            return response()->json([
                'livestock_dev_fund_total' => $result->Livestock_Dev_Fund_Total ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching livestock dev fund total: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
