<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers; // ✅ Import your helper

class RealPropertyTaxDataBldgDataController extends Controller
{
    public function index(Request $request)
    {
        try {
            $statuses = [
                'MACHINERY'    => 'MACHINERIES',
                'BLDG-RES'     => 'BLDG-RES',
                'BLDG-COMML'   => 'BLDG-COMML',
                'BLDG-INDUS'   => 'BLDG-INDUS',
            ];

            $results = [];

            foreach ($statuses as $statusCode => $label) {
                $query = DB::table('real_property_tax_data')
                    ->selectRaw("'{$label}' AS category")
                    ->selectRaw('IFNULL(SUM(current_year), 0) AS current')
                    ->selectRaw('IFNULL(SUM(current_discounts), 0) AS discount')
                    ->selectRaw('IFNULL(SUM(prev_year + prior_years), 0) AS prior')
                    ->selectRaw('IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent')
                    ->selectRaw('IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior')
                    ->where('status', $statusCode);

                // ✅ Apply reusable date filters
                $query = QueryHelpers::addDateFilters($query, $request, 'date');

                $results[] = (array) $query->first();
            }

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

            $totals['totalSum'] =
                $totals['current'] -
                $totals['discount'] +
                $totals['prior'] +
                $totals['penaltiesCurrent'] +
                $totals['penaltiesPrior'];

            Log::info("Backend Building Total Sum: ₱" . number_format($totals['totalSum'], 2));

            return response()->json([...$results, $totals]);

        } catch (\Exception $e) {
            Log::error("Error fetching building data: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching building data'], 500);
        }
    }
}
