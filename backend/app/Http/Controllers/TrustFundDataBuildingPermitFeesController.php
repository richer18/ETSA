<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataBuildingPermitFeesController extends Controller
{
    public function index(Request $request)
    {
        try {
            $year = $request->query('year');
            $month = $request->query('month');
            $day = $request->query('day');

            $conditions = [];
            if ($year) {
                $conditions[] = "YEAR(date) = " . DB::getPdo()->quote($year);
            }
            if ($month) {
                $conditions[] = "MONTH(date) = " . DB::getPdo()->quote($month);
            }
            if ($day) {
                $conditions[] = "DAY(date) = " . DB::getPdo()->quote($day);
            }

            $whereClause = !empty($conditions) ? " WHERE " . implode(" AND ", $conditions) : "";

            $sql = "
                SELECT 'Building Local Fund 80%' AS Taxes, SUM(LOCAL_80_PERCENT) AS Total FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Building Trust Fund 15%', SUM(TRUST_FUND_15_PERCENT) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Building National Fund 5% ', SUM(NATIONAL_5_PERCENT) FROM trust_fund_data $whereClause
                UNION ALL
                SELECT 'Overall Total', SUM(LOCAL_80_PERCENT+TRUST_FUND_15_PERCENT+NATIONAL_5_PERCENT) FROM trust_fund_data $whereClause
            ";

            $results = DB::select($sql);
            return response()->json($results);

        } catch (\Exception $e) {
            Log::error("Error fetching building permit fees: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
