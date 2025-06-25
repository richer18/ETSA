<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataSefLandSharingDataController extends Controller
{
    public function index(Request $request)
    {
        $year  = (int) $request->query('year');
        $month = (int) $request->query('month');
        $day   = (int) $request->query('day');

        try {
            // Build date filter
            $dateFilter = "";
            if ($year && $month && $day) {
                $date = sprintf('%04d-%02d-%02d', $year, $month, $day);
                $dateFilter = "AND DATE(`date`) = '{$date}'";
            } elseif ($year && $month) {
                $dateFilter = "AND YEAR(`date`) = {$year} AND MONTH(`date`) = {$month}";
            } elseif ($year) {
                $dateFilter = "AND YEAR(`date`) = {$year}";
            }

            $sql = "
                WITH LandData AS (
                    SELECT 'Current' AS category,
                        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS amount
                    FROM real_property_tax_data
                    WHERE status LIKE 'LAND-%' {$dateFilter}

                    UNION ALL

                    SELECT 'Prior' AS category,
                        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS amount
                    FROM real_property_tax_data
                    WHERE status LIKE 'LAND-%' {$dateFilter}

                    UNION ALL

                    SELECT 'Penalties' AS category,
                        SUM(
                            IFNULL(additional_penalties, 0) +
                            IFNULL(additional_prev_penalties, 0) +
                            IFNULL(additional_prior_penalties, 0)
                        ) AS amount
                    FROM real_property_tax_data
                    WHERE status LIKE 'LAND-%' {$dateFilter}
                )

                SELECT
                    category,
                    amount AS LAND,
                    amount * 0.50 AS `50% Prov’l Share`,
                    amount * 0.50 AS `50% Mun. Share`
                FROM LandData

                UNION ALL

                SELECT
                    'TOTAL' AS category,
                    SUM(amount) AS LAND,
                    SUM(amount) * 0.50 AS `50% Prov’l Share`,
                    SUM(amount) * 0.50 AS `50% Mun. Share`
                FROM LandData;
            ";

            $results = DB::select($sql);

            return response()->json($results);

        } catch (\Exception $e) {
            Log::error('Error fetching SEF land sharing data: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching SEF land sharing data'], 500);
        }
    }
}
