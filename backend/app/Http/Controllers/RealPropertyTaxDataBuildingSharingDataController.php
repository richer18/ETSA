<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataBuildingSharingDataController extends Controller
{
    public function index(Request $request)
    {
        $year  = (int) $request->query('year');
        $month = (int) $request->query('month');
        $day   = (int) $request->query('day');

        try {
            $where = "WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')";

            if ($year && $month && $day) {
                $dateStr = sprintf('%04d-%02d-%02d', $year, $month, $day);
                $where .= " AND DATE(`date`) = '{$dateStr}'";
            } elseif ($year && $month) {
                $where .= " AND YEAR(`date`) = {$year} AND MONTH(`date`) = {$month}";
            } elseif ($year) {
                $where .= " AND YEAR(`date`) = {$year}";
            }

            $sql = "
                SELECT
                'Current' AS category,
                SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS `BUILDING`,
                  SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.35) AS `35% Prov’l Share`,
                  SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.40) AS `40% Mun. Share`,
                  SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.25) AS `25% Brgy. Share`
                FROM real_property_tax_data
                {$where}
                UNION ALL
                SELECT
                'Prior' AS category,
                SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS `BUILDING`,
                  SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.35) AS `35% Prov’l Share`,
                  SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.40) AS `40% Mun. Share`,
                  SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.25) AS `25% Brgy. Share`
                FROM real_property_tax_data
                {$where}
                UNION ALL
                SELECT
                'Penalties' AS category,
                SUM(
                    IFNULL(current_penalties, 0) +
                    IFNULL(prev_penalties, 0) +
                    IFNULL(prior_penalties, 0)
                    ) AS `BUILDING`,
                    SUM(
                    (IFNULL(current_penalties, 0) +
                    IFNULL(prev_penalties, 0) +
                     IFNULL(prior_penalties, 0)) * 0.35
                     ) AS `35% Prov’l Share`,
                     SUM(
                    (IFNULL(current_penalties, 0) +
                    IFNULL(prev_penalties, 0) +
                     IFNULL(prior_penalties, 0)) * 0.40
                     ) AS `40% Mun. Share`,
                      SUM(
                    (IFNULL(current_penalties, 0) +
                     IFNULL(prev_penalties, 0) +
                     IFNULL(prior_penalties, 0)) * 0.25
                  ) AS `25% Brgy. Share`
                FROM real_property_tax_data
                {$where}
                UNION ALL
                SELECT
                'TOTAL' AS category,
                SUM(
                    (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                    (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                    (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
                    ) AS `BUILDING`,
                     SUM(
                    ((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                     (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                     (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) * 0.35
                  ) AS `35% Prov’l Share`,
                  SUM(
                    ((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                     (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                     (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) * 0.40
                  ) AS `40% Mun. Share`,
                  SUM(
                    ((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                     (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                     (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) * 0.25
                  ) AS `25% Brgy. Share`
                FROM real_property_tax_data
                {$where}
            ";

            $results = DB::select($sql);

            return response()->json($results);

        } catch (\Exception $e) {
            Log::error("Error fetching building sharing data: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching building sharing data'], 500);
        }
    }
}
