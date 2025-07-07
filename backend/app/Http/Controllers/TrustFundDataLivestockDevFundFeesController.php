<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataLivestockDevFundFeesController extends Controller
{
    public function __invoke(Request $request)
    {
        $year  = $request->query('year');
        $month = $request->query('month');
        $day   = $request->query('day');

        try {
            // Base UNION ALL query
            $sql = "
                SELECT 'Livestock Dev Fund Local 80%' AS Taxes, SUM(LOCAL_80_PERCENT_LIVESTOCK) AS Total FROM trust_fund_data
                UNION ALL
                SELECT 'Livestock Dev Fund National 20%', SUM(NATIONAL_20_PERCENT) FROM trust_fund_data
                UNION ALL
                SELECT 'Overall Total', SUM(LOCAL_80_PERCENT_LIVESTOCK + NATIONAL_20_PERCENT) AS Total FROM trust_fund_data
            ";

            // Build optional WHERE conditions
            $conditions = [];
            $bindings = [];

            if ($year) {
                $conditions[] = 'YEAR(`date`) = ?';
                $bindings[]  = $year;
            }
            if ($month) {
                $conditions[] = 'MONTH(`date`) = ?';
                $bindings[]  = $month;
            }
            if ($day) {
                $conditions[] = 'DAY(`date`) = ?';
                $bindings[]  = $day;
            }

            // If filters exist, apply them to every SELECT
            if (!empty($conditions)) {
                $where = ' WHERE ' . implode(' AND ', $conditions);
                $sql = str_replace(' FROM trust_fund_data', ' FROM trust_fund_data' . $where, $sql);
            }

            $results = DB::select($sql, $bindings);

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Error fetching Livestock Dev Fund fees: '.$e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
