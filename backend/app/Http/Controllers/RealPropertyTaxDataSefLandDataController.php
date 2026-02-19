<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataSefLandDataController extends Controller
{
    public function index(Request $request)
    {
        try {
            $categories = [
                'LAND-AGRI'   => 'AGRI',
                'LAND-RES'    => 'RES',
                'LAND-COMML'  => 'COMML',
                'SPECIAL'     => 'SPECIAL',
            ];

            $results = [];

            foreach ($categories as $statusCode => $label) {
                $query = DB::table('real_property_tax_data')
                    ->selectRaw("'{$label}' AS category")
                    ->selectRaw('IFNULL(SUM(additional_current_year), 0) AS current')
                    ->selectRaw('IFNULL(SUM(additional_discounts), 0) AS discount')
                    ->selectRaw('IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior')
                    ->selectRaw('IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent')
                    ->selectRaw('IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior')
                    ->where('status', $statusCode);

                // ✅ Use reusable helper
                $query = QueryHelpers::addDateFilters($query, $request, 'date');

                $results[] = (array) $query->first();
            }

            // 🔢 Total Aggregation
            $totals = [
                'category' => 'TOTAL',
                'current' => 0,
                'discount' => 0,
                'prior' => 0,
                'penaltiesCurrent' => 0,
                'penaltiesPrior' => 0,
            ];

            foreach ($results as $row) {
                $totals['current'] += $row['current'];
                $totals['discount'] += $row['discount'];
                $totals['prior'] += $row['prior'];
                $totals['penaltiesCurrent'] += $row['penaltiesCurrent'];
                $totals['penaltiesPrior'] += $row['penaltiesPrior'];
            }

            // 📊 Compute SEF Total
            $totals['totalSum'] =
                $totals['current'] -
                $totals['discount'] +
                $totals['prior'] +
                $totals['penaltiesCurrent'] +
                $totals['penaltiesPrior'];

            Log::info("SEF Land Total = ₱" . number_format($totals['totalSum'], 2));

            return response()->json([...$results, $totals]);

        } catch (\Exception $e) {
            Log::error("Error fetching SEF land data: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching SEF land data'], 500);
        }
    }
}
