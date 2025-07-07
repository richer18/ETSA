<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataElectricalPermitFeesController extends Controller
{
    public function __invoke(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        $day = $request->query('day');

        try {
            // Define base query
            $filters = [];
            $bindings = [];

            if ($year) {
                $filters[] = 'YEAR(`DATE`) = ?';
                $bindings[] = $year;
            }

            if ($month) {
                $filters[] = 'MONTH(`DATE`) = ?';
                $bindings[] = $month;
            }

            if ($day) {
                $filters[] = 'DAY(`DATE`) = ?';
                $bindings[] = $day;
            }

            $whereClause = '';
            if ($filters) {
                $whereClause = ' WHERE ' . implode(' AND ', $filters);
            }

            // SQL with filtering injected into each part
            $sql = "
                SELECT 'Electrical Fee' AS Taxes, SUM(ELECTRICAL_FEE) AS Total FROM trust_fund_data {$whereClause}
                UNION ALL
                SELECT 'Overall Total', SUM(ELECTRICAL_FEE) FROM trust_fund_data {$whereClause}
            ";

            $results = DB::select($sql, array_merge($bindings, $bindings));

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("Failed to fetch electrical permit fee totals: " . $e->getMessage());
            return response()->json(['error' => 'Error retrieving electrical permit fee totals'], 500);
        }
    }
}
