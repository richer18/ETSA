<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ServiceUserChargesBreakdownDataController extends Controller
{
    public function index(Request $request)
    {
        $year = (int) $request->query('year');
        $months = $request->query('months');

        if (!$year || !is_numeric($year)) {
            return response()->json([
                'error' => 'Invalid or missing "year" parameter',
                'code' => 'INVALID_YEAR',
            ], 400);
        }

        $monthList = collect(explode(',', $months))
            ->map(fn($m) => (int) $m)
            ->filter(fn($m) => $m >= 1 && $m <= 12)
            ->values()
            ->toArray();

        // Base where clause
        $monthClause = '';

        if (!empty($monthList)) {
            $placeholders = implode(',', array_fill(0, count($monthList), '?'));
            $monthClause = " AND MONTH(date) IN ($placeholders)";
        }

        try {
            // Apply binding set per query block
            $bindings = [];
            for ($i = 0; $i < 3; $i++) {
                $bindings[] = $year;
                $bindings = array_merge($bindings, $monthList);
            }

            $sql = "
                SELECT category, SUM(total) AS total_amount FROM (
                    SELECT 'Secretaries Fee' AS category,
                        SUM(COALESCE(Secretaries_Fee, 0) + COALESCE(Police_Report_Clearance, 0)) AS total
                    FROM general_fund_data
                    WHERE YEAR(date) = ? {$monthClause}

                    UNION ALL

                    SELECT 'Garbage Fees' AS category,
                        SUM(COALESCE(Garbage_Fees, 0)) AS total
                    FROM general_fund_data
                    WHERE YEAR(date) = ? {$monthClause}

                    UNION ALL

                    SELECT 'Med./Lab Fees' AS category,
                        SUM(COALESCE(Med_Dent_Lab_Fees, 0)) AS total
                    FROM general_fund_data
                    WHERE YEAR(date) = ? {$monthClause}
                ) AS summary
                GROUP BY category
            ";

            $results = DB::select($sql, $bindings);

            return response()->json([
                'year' => $year,
                'months' => $monthList,
                'currency' => 'PHP',
                'breakdown' => $results
            ]);
        } catch (\Exception $e) {
            Log::error("ServiceUserCharges DB error: " . $e->getMessage());
            return response()->json([
                'error' => 'Database error',
                'code' => 'DB_ERROR',
            ], 500);
        }
    }
}
