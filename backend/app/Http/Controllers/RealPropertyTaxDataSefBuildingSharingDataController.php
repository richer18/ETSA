<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataSefBuildingSharingDataController extends Controller
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
                SELECT 'Current' AS category,
                SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS `BUILDING`,
                  SUM((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) * 0.50) AS `50% Prov’l Share`,
                  SUM((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) * 0.50) AS `50% Mun. Share`
                FROM real_property_tax_data
                {$where}
                UNION ALL
                SELECT
                'Prior' AS category,
                SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS `BUILDING`,
                  SUM((IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) * 0.50) AS `50% Prov’l Share`,
                  SUM((IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) * 0.50) AS `50% Mun. Share`
                FROM real_property_tax_data
                {$where}
                UNION ALL
                SELECT
                'Penalties' AS category,
                SUM(
                    IFNULL(additional_penalties, 0) +
                    IFNULL(additional_prev_penalties, 0) +
                    IFNULL(additional_prior_penalties, 0)
                    ) AS `BUILDING`, SUM(
                    (IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) +
                     IFNULL(additional_prior_penalties, 0)) * 0.50) AS `50% Prov’l Share`, SUM(
                    (IFNULL(additional_penalties, 0) +
                    IFNULL(additional_prev_penalties, 0) +
                     IFNULL(additional_prior_penalties, 0)) * 0.50) AS `50% Mun. Share`
                FROM real_property_tax_data
                {$where}
                UNION ALL
                SELECT
                'TOTAL' AS category,
                SUM(
                    (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
                    (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
                    (IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0))
                    ) AS `BUILDING`,SUM(
                    ((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +(IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0))
                    ) * 0.50) AS `50% Prov’l Share`,SUM(
                    ((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +(IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0))
                    ) * 0.50) AS `50% Mun. Share`
                FROM real_property_tax_data
                {$where}
            ";

            $results = DB::select($sql);
            return response()->json($results);

        } catch (\Exception $e) {
            Log::error('Error fetching SEF building sharing data: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching SEF building sharing data'], 500);
        }
    }
}
