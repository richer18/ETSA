<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataDivingFeesController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $conditions = [];
            $bindings = [];

            if ($request->filled('year')) {
                $conditions[] = 'YEAR(date) = ?';
                $bindings[] = $request->query('year');
            }
            if ($request->filled('month')) {
                $conditions[] = 'MONTH(date) = ?';
                $bindings[] = $request->query('month');
            }
            if ($request->filled('day')) {
                $conditions[] = 'DAY(date) = ?';
                $bindings[] = $request->query('day');
            }

            $whereClause = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';

            $sql = "
                SELECT 'Diving Fee Local 40%' AS Taxes, SUM(LOCAL_40_PERCENT_DIVE_FEE) AS Total FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Diving Fee Fishers 30%', SUM(FISHERS_30_PERCENT) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Diving Fee Brgy 30%', SUM(BRGY_30_PERCENT) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Overall Total', SUM(LOCAL_40_PERCENT_DIVE_FEE + FISHERS_30_PERCENT + BRGY_30_PERCENT) FROM trust_fund_data $whereClause
            ";

            $results = DB::select($sql, array_merge($bindings, $bindings, $bindings, $bindings));

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("Error fetching diving fee report: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
