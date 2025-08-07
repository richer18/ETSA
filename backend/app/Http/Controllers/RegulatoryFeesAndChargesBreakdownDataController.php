<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegulatoryFeesAndChargesBreakdownDataController extends Controller
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
            ->map(fn ($m) => (int) $m)
            ->filter(fn ($m) => $m >= 1 && $m <= 12)
            ->values()
            ->toArray();

        $paramsGeneral = [$year];
        $paramsTrust = [$year];
        $monthConditionGeneral = '';
        $monthConditionTrust = '';

        if (!empty($monthList)) {
            $placeholders = implode(',', array_fill(0, count($monthList), '?'));
            $monthConditionGeneral = " AND MONTH(date) IN ({$placeholders})";
            $monthConditionTrust = " AND MONTH(DATE) IN ({$placeholders})";
            $paramsGeneral = array_merge($paramsGeneral, $monthList);
            $paramsTrust = array_merge($paramsTrust, $monthList);
        }

        // Build the SQL query with all UNION parts
        $sql = "
            SELECT category, SUM(total) AS total_amount FROM (
                SELECT 'WEIGHS AND MEASURE' AS category, SUM(Weighs_Measure) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'TRICYCLE PERMIT FEE' AS category, SUM(Tricycle_Operators) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'OCCUPATION TAX' AS category, SUM(Occupation_Tax) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'OTHER PERMITS AND LICENSE' AS category,
                    SUM(Docking_Mooring_Fee + Cockpit_Prov_Share + Cockpit_Local_Share +
                        Sultadas + Miscellaneous_Fee + Fishing_Permit_Fee +
                        Sale_of_Agri_Prod + Sale_of_Acct_Form) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'OTHER PERMITS AND LICENSE' AS category,
                    SUM(LIVESTOCK_DEV_FUND + DIVING_FEE) AS total
                FROM trust_fund_data
                WHERE YEAR(DATE) = ? {$monthConditionTrust}

                UNION ALL

                SELECT 'CIVIL REGISTRATION' AS category,
                    SUM(Reg_of_Birth + Marriage_Fees + Burial_Fees + Correction_of_Entry) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'CATTLE/ANIMAL REGISTRATION FEES' AS category,
                    SUM(Cert_of_Ownership + Cert_of_Transfer) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'BUILDING PERMITS' AS category,
                    SUM(BUILDING_PERMIT_FEE + ELECTRICAL_FEE) AS total
                FROM trust_fund_data
                WHERE YEAR(DATE) = ? {$monthConditionTrust}

                UNION ALL

                SELECT 'BUSINESS PERMITS' AS category, SUM(Mayors_Permit) AS total
                FROM general_fund_data
                WHERE YEAR(date) = ? {$monthConditionGeneral}

                UNION ALL

                SELECT 'ZONING/LOCATION PERMIT FEES' AS category, SUM(ZONING_FEE) AS total
                FROM trust_fund_data
                WHERE YEAR(DATE) = ? {$monthConditionTrust}
            ) AS summary
            GROUP BY category
        ";

        // Construct final parameter list matching the order of UNION
        $finalParams = [
            ...$paramsGeneral,  // for the first four general selectors
            ...$paramsGeneral,
            ...$paramsGeneral,
            ...$paramsGeneral,
            ...$paramsTrust,    // for fifth selector from trust
            ...$paramsGeneral,  // sixth
            ...$paramsGeneral,  // seventh
            ...$paramsTrust,    // eight
            ...$paramsGeneral,  // ninth
            ...$paramsTrust,    // tenth
        ];

        try {
            $results = DB::select($sql, $finalParams);

            return response()->json([
                'year' => $year,
                'months' => $monthList,
                'currency' => 'PHP', // adjust as needed
                'breakdown' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Regulatory Fees DB error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Database error',
                'code' => 'DB_ERROR'
            ], 500);
        }
    }
}
