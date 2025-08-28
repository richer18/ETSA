<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataSefBuildingSharingDataController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 📥 Input filters
            $year = (int) $request->query('year');
            $months = array_filter(array_map('intval', explode(',', $request->query('month', ''))));
            $month = isset($months[0]) ? $months[0] : null;
            $day = (int) $request->query('day');

            // 🧱 Base WHERE clause
            $where = "WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')";

            if ($year && $month && $day) {
                $dateStr = sprintf('%04d-%02d-%02d', $year, $month, $day);
                $where .= " AND DATE(`date`) = '{$dateStr}'";
            } elseif ($year && !empty($months)) {
                $monthList = implode(',', $months);
                $where .= " AND YEAR(`date`) = {$year} AND MONTH(`date`) IN ({$monthList})";
            } elseif ($year) {
                $where .= " AND YEAR(`date`) = {$year}";
            }

            // 🧠 Query with breakdown and totals
            $sql = "
    SELECT 'Current' AS category,
        ROUND(SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)), 2) AS `BUILDING`,
        ROUND(SUM((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) * 0.50), 2) AS `50% Prov’l Share`,
        ROUND(SUM((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) * 0.50), 2) AS `50% Mun. Share`
    FROM real_property_tax_data
    {$where}

    UNION ALL

    SELECT 'Prior' AS category,
        ROUND(SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)), 2) AS `BUILDING`,
        ROUND(SUM((IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) * 0.50), 2) AS `50% Prov’l Share`,
        ROUND(SUM((IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) * 0.50), 2) AS `50% Mun. Share`
    FROM real_property_tax_data
    {$where}

    UNION ALL

    SELECT 'Penalties' AS category,
        ROUND(SUM(
            IFNULL(additional_penalties, 0) +
            IFNULL(additional_prev_penalties, 0) +
            IFNULL(additional_prior_penalties, 0)
        ), 2) AS `BUILDING`,
        ROUND(SUM((IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)) * 0.50), 2) AS `50% Prov’l Share`,
        ROUND(SUM((IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)) * 0.50), 2) AS `50% Mun. Share`
    FROM real_property_tax_data
    {$where}

    UNION ALL

    SELECT 'TOTAL' AS category,
        ROUND(SUM(
            (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
            (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
            (IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0))
        ), 2) AS `BUILDING`,
        ROUND(SUM((
            (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
            (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
            (IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0))
        ) * 0.50), 2) AS `50% Prov’l Share`,
        ROUND(SUM((
            (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
            (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
            (IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0))
        ) * 0.50), 2) AS `50% Mun. Share`
    FROM real_property_tax_data
    {$where}
";


            $results = DB::select($sql);
            Log::info("✅ SEF Building Sharing Data fetched successfully");
            return response()->json($results);

        } catch (\Exception $e) {
            Log::error('❌ Error fetching SEF building sharing data: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching SEF building sharing data'], 500);
        }
    }
}
