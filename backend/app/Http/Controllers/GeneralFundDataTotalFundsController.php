<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class GeneralFundDataTotalFundsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('general_fund_data');

            // Apply optional month, day, year filtering via helper
            $query = QueryHelpers::addDateFilters($query, $request);

            // Sum the 'total' column
            $total = $query->sum('total');

            return response()->json([
                'overall_total' => $total
            ]);

        } catch (\Exception $e) {
            \Log::error('❌ Error fetching total general funds: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
