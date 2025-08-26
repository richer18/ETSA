<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegulatoryFeesController extends Controller
{
    public function index(Request $request)
    {
        try {
            $year = $request->input('year');
            $months = $request->input('months'); // "1,2,3"

            if (!$year || !$months) {
                return response()->json(['error' => 'Year and months are required'], 400);
            }

            $monthsArray = array_map('intval', explode(',', $months));
            $placeholders = implode(',', array_fill(0, count($monthsArray), '?'));

            $sql = "
                SELECT category, SUM(total) AS total_amount FROM (
                    SELECT 'WEIGHS AND MEASURE' AS category, SUM(Weighs_Measure) AS total
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'TRICYCLE PERMIT FEE', SUM(Tricycle_Operators)
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'OCCUPATION TAX', SUM(Occupation_Tax)
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'OTHER PERMIT AND LICENSE',
                           SUM(Docking_Mooring_Fee + Cockpit_Prov_Share + Cockpit_Local_Share +
                               Sultadas + Miscellaneous_Fee + Fishing_Permit_Fee +
                               Sale_of_Agri_Prod + Sale_of_Acct_Form)
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'OTHER PERMIT AND LICENSE',
                           SUM(LIVESTOCK_DEV_FUND + DIVING_FEE)
                    FROM trust_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'CIVIL REGISTRATION',
                           SUM(Reg_of_Birth + Marriage_Fees + Burial_Fees + Correction_of_Entry)
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'CATTLE/ANIMAL REGISTRATION FEES',
                           SUM(Cert_of_Ownership + Cert_of_Transfer)
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'BUILDING PERMITS',
                           SUM(BUILDING_PERMIT_FEE + ELECTRICAL_FEE)
                    FROM trust_fund_data
                    WHERE YEAR(DATE) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'BUSINESS PERMITS', SUM(Mayors_Permit)
                    FROM general_fund_data
                    WHERE YEAR(date) = ? AND MONTH(date) IN ($placeholders)

                    UNION ALL
                    SELECT 'ZONIAL/LOCATION PERMIT FEES', SUM(ZONING_FEE)
                    FROM trust_fund_data
                    WHERE YEAR(DATE) = ? AND MONTH(DATE) IN ($placeholders)
                ) summary
                GROUP BY category
            ";

            // build parameters for all placeholders
            $params = [];
            for ($i = 0; $i < 11; $i++) { // 10 UNION queries
                $params[] = $year;
                $params = array_merge($params, $monthsArray);
            }

            $results = DB::select($sql, $params);

            // ✅ Add overall total
            $overallTotal = array_sum(array_column($results, 'total_amount'));
            $results[] = (object)[
                "category" => "OVERALL TOTAL",
                "total_amount" => $overallTotal
            ];

            return response()->json([
                "year" => (int)$year,
                "months" => $monthsArray,
                "currency" => "PHP",
                "breakdown" => $results
            ]);

        } catch (\Exception $e) {
            Log::error("Error fetching regulatory fees: " . $e->getMessage());
            return response()->json(["error" => "Failed to fetch data"], 500);
        }
    }
}
