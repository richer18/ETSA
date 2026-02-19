<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class TrustFundDataZoningFeeTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('trust_fund_data')
                ->selectRaw('SUM(ZONING_FEE) AS Zoning_Fee_Total');

            // ✅ Apply optional date filters using helper
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $result = $query->first();

            return response()->json([
                'zoning_fee_total' => $result->Zoning_Fee_Total ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching zoning fee total: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
