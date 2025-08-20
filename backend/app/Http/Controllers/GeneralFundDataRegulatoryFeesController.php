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
            $months = $request->input('months'); // example: "1,2,3"

            if (!$year || !$months) {
                return response()->json(['error' => 'Year and months are required'], 400);
            }

            // Convert months string to array
            $monthsArray = explode(',', $months);
            $monthsList = implode(',', array_map('intval', $monthsArray)); // safe for SQL

            $sql = "
                SELECT category, SUM(total) AS total_amount
                FROM (
                    -- WEIGHS AND MEASURE
                    SELECT 'WEIGHS AND MEASURE' AS category,
                           COALESCE(SUM(Weighs_Measure), 0) AS total
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- TRICYCLE PERMIT FEE
                    SELECT 'TRICYCLE PERMIT FEE',
                           COALESCE(SUM(Tricycle_Operators), 0)
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- OCCUPATION TAX
                    SELECT 'OCCUPATION TAX',
                           COALESCE(SUM(Occupation_Tax), 0)
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- OTHER PERMIST AND LICENSE (general fund)
                    SELECT 'OTHER PERMIST AND LICENSE',
                           (
                               COALESCE(SUM(Docking_Mooring_Fee), 0) +
                               COALESCE(SUM(Cockpit_Prov_Share), 0) +
                               COALESCE(SUM(Cockpit_Local_Share), 0) +
                               COALESCE(SUM(Sultadas), 0) +
                               COALESCE(SUM(Miscellaneous_Fee), 0) +
                               COALESCE(SUM(Fishing_Permit_Fee), 0) +
                               COALESCE(SUM(Sale_of_Agri_Prod), 0) +
                               COALESCE(SUM(Sale_of_Acct_Form), 0)
                           )
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- OTHER PERMIST AND LICENSE (trust fund)
                    SELECT 'OTHER PERMIST AND LICENSE',
                           (
                               COALESCE(SUM(LIVESTOCK_DEV_FUND), 0) +
                               COALESCE(SUM(DIVING_FEE), 0)
                           )
                    FROM trust_fund_data
                    WHERE YEAR(`DATE`) = {$year} AND MONTH(`DATE`) IN ({$monthsList})

                    UNION ALL

                    -- CIVIL REGISTRATION
                    SELECT 'CIVIL REGISTRATION',
                           (
                               COALESCE(SUM(Reg_of_Birth), 0) +
                               COALESCE(SUM(Marriage_Fees), 0) +
                               COALESCE(SUM(Burial_Fees), 0) +
                               COALESCE(SUM(Correction_of_Entry), 0)
                           )
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- CATTLE/ANIMAL REGISTRATION FEES
                    SELECT 'CATTLE/ANIMAL REGISTRATION FEES',
                           (
                               COALESCE(SUM(Cert_of_Ownership), 0) +
                               COALESCE(SUM(Cert_of_Transfer), 0)
                           )
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- BUILDING PERMITS
                    SELECT 'BUILDING PERMITS',
                           (
                               COALESCE(SUM(BUILDING_PERMIT_FEE), 0) +
                               COALESCE(SUM(ELECTRICAL_FEE), 0)
                           )
                    FROM trust_fund_data
                    WHERE YEAR(`DATE`) = {$year} AND MONTH(`DATE`) IN ({$monthsList})

                    UNION ALL

                    -- BUSINESS PERMITS
                    SELECT 'BUSINESS PERMITS',
                           COALESCE(SUM(Mayors_Permit), 0)
                    FROM general_fund_data
                    WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})

                    UNION ALL

                    -- ZONIAL/LOCATION PERMIT FEES
                    SELECT 'ZONIAL/LOCATION PERMIT FEES',
                           COALESCE(SUM(ZONING_FEE), 0)
                    FROM trust_fund_data
                    WHERE YEAR(`DATE`) = {$year} AND MONTH(`DATE`) IN ({$monthsList})
                ) AS summary
                GROUP BY category

                UNION ALL

                -- OVERALL TOTAL
                SELECT 'OVERALL TOTAL', SUM(total)
                FROM (
                    SELECT COALESCE(SUM(Weighs_Measure),0) total FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT COALESCE(SUM(Tricycle_Operators),0) FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT COALESCE(SUM(Occupation_Tax),0) FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT (
                        COALESCE(SUM(Docking_Mooring_Fee),0) +
                        COALESCE(SUM(Cockpit_Prov_Share),0) +
                        COALESCE(SUM(Cockpit_Local_Share),0) +
                        COALESCE(SUM(Sultadas),0) +
                        COALESCE(SUM(Miscellaneous_Fee),0) +
                        COALESCE(SUM(Fishing_Permit_Fee),0) +
                        COALESCE(SUM(Sale_of_Agri_Prod),0) +
                        COALESCE(SUM(Sale_of_Acct_Form),0)
                    ) FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT (
                        COALESCE(SUM(LIVESTOCK_DEV_FUND),0) +
                        COALESCE(SUM(DIVING_FEE),0)
                    ) FROM trust_fund_data WHERE YEAR(`DATE`) = {$year} AND MONTH(`DATE`) IN ({$monthsList})
                    UNION ALL
                    SELECT (
                        COALESCE(SUM(Reg_of_Birth),0) +
                        COALESCE(SUM(Marriage_Fees),0) +
                        COALESCE(SUM(Burial_Fees),0) +
                        COALESCE(SUM(Correction_of_Entry),0)
                    ) FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT (
                        COALESCE(SUM(Cert_of_Ownership),0) +
                        COALESCE(SUM(Cert_of_Transfer),0)
                    ) FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT (
                        COALESCE(SUM(BUILDING_PERMIT_FEE),0) +
                        COALESCE(SUM(ELECTRICAL_FEE),0)
                    ) FROM trust_fund_data WHERE YEAR(`DATE`) = {$year} AND MONTH(`DATE`) IN ({$monthsList})
                    UNION ALL
                    SELECT COALESCE(SUM(Mayors_Permit),0) FROM general_fund_data WHERE YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthsList})
                    UNION ALL
                    SELECT COALESCE(SUM(ZONING_FEE),0) FROM trust_fund_data WHERE YEAR(`DATE`) = {$year} AND MONTH(`DATE`) IN ({$monthsList})
                ) AS total_summary
            ";

            $results = DB::select(DB::raw($sql));

            return response()->json(['breakdown' => $results]);

        } catch (\Exception $e) {
            Log::error("Error fetching regulatory fees: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
