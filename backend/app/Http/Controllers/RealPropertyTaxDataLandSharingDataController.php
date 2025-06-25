<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataLandSharingDataController extends Controller
{
    public function index(Request $request)
    {
        try {
            // ⏳ Get filters
            $year = (int) $request->query('year');
            $month = (int) $request->query('month');
            $day = (int) $request->query('day');

            // 🧱 Build base query
            $query = DB::table('real_property_tax_data')
                ->where('status', 'LIKE', 'LAND%');

            if ($year && $month && $day) {
                $query->whereDate('date', sprintf('%04d-%02d-%02d', $year, $month, $day));
            } elseif ($year && $month) {
                $query->whereYear('date', $year)->whereMonth('date', $month);
            } elseif ($year) {
                $query->whereYear('date', $year);
            }

            // 🛠 Define the breakdowns
            $breakdowns = [
                'Current' => [
                    'land' => "SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0))",
                ],
                'Prior' => [
                    'land' => "SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0))",
                ],
                'Penalties' => [
                    'land' => "SUM(IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))",
                ],
            ];

            $results = [];

            foreach ($breakdowns as $label => $expr) {
                $select = "
                    '{$label}' AS category,
                    {$expr['land']} AS LAND,
                    {$expr['land']} * 0.35 AS `35% Prov’l Share`,
                    {$expr['land']} * 0.40 AS `40% Mun. Share`,
                    {$expr['land']} * 0.25 AS `25% Brgy. Share`
                ";

                $results[] = (clone $query)->selectRaw($select)->first();
            }

            // 🔢 TOTAL computation
            $totalSelect = "
                'TOTAL' AS category,
                SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                    (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                    (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) AS LAND,
                SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                    (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                    (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) * 0.35 AS `35% Prov’l Share`,
                SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                    (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                    (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) * 0.40 AS `40% Mun. Share`,
                SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
                    (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
                    (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))) * 0.25 AS `25% Brgy. Share`
            ";

            $results[] = (clone $query)->selectRaw($totalSelect)->first();

            Log::info("✅ Land Sharing Data fetched successfully");

            return response()->json($results);

        } catch (\Exception $e) {
            Log::error("❌ Error fetching land sharing data: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching land sharing data'], 500);
        }
    }
}
