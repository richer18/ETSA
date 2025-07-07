<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataTotalFeesReportsController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $filters = [];
            $bindings = [];

            if ($request->filled('year')) {
                $filters[] = 'YEAR(`DATE`) = ?';
                $bindings[] = $request->year;
            }
            if ($request->filled('month')) {
                $filters[] = 'MONTH(`DATE`) = ?';
                $bindings[] = $request->month;
            }
            if ($request->filled('day')) {
                $filters[] = 'DAY(`DATE`) = ?';
                $bindings[] = $request->day;
            }

            $whereClause = '';
            if (!empty($filters)) {
                $whereClause = ' WHERE ' . implode(' AND ', $filters);
            }

            // Write all SELECTs with WHERE clause injected
            $sql = "
                SELECT 'Building Permit Fee' AS Taxes, SUM(BUILDING_PERMIT_FEE) AS Total FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Electrical Permit Fee', SUM(ELECTRICAL_FEE) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Zoning Fee', SUM(ZONING_FEE) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Livestock Dev. Fund', SUM(LIVESTOCK_DEV_FUND) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Diving Fee', SUM(DIVING_FEE) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Overall Total', SUM(
                    BUILDING_PERMIT_FEE + ELECTRICAL_FEE + ZONING_FEE + LIVESTOCK_DEV_FUND + DIVING_FEE
                ) FROM trust_fund_data $whereClause
            ";

            $results = DB::select($sql, array_merge(...array_fill(0, 6, $bindings)));

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Error fetching total trust fund fees: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
