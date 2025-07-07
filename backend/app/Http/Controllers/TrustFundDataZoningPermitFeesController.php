<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataZoningPermitFeesController extends Controller
{
    public function __invoke(Request $request)
    {
        $year  = $request->query('year');
        $month = $request->query('month');
        $day   = $request->query('day');

        try {
            $conditions = [];
            $bindings = [];

            if ($year) {
                $conditions[] = 'YEAR(`DATE`) = ?';
                $bindings[] = $year;
            }
            if ($month) {
                $conditions[] = 'MONTH(`DATE`) = ?';
                $bindings[] = $month;
            }
            if ($day) {
                $conditions[] = 'DAY(`DATE`) = ?';
                $bindings[] = $day;
            }

            $whereClause = !empty($conditions)
                ? ' WHERE ' . implode(' AND ', $conditions)
                : '';

            $baseQuery = "
                SELECT 'Zoning Fee' AS Taxes, SUM(ZONING_FEE) AS Total FROM trust_fund_data
                UNION ALL
                SELECT 'Overall Total', SUM(ZONING_FEE) FROM trust_fund_data
            ";

            // More efficient replacement
            if ($whereClause) {
                $baseQuery = str_replace('FROM trust_fund_data', "FROM trust_fund_data$whereClause", $baseQuery);
            }

            $results = DB::select($baseQuery, $bindings);

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Error fetching zoning permit fees: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
