<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataSefBldgDataController extends Controller
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
                    ->selectRaw('IFNULL(SUM(additional_current_year), 0) AS current')
                    ->selectRaw('IFNULL(SUM(additional_discounts), 0) AS discount')
                    ->selectRaw('IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior')
                    ->selectRaw('IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent')
                    ->selectRaw('IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior')
                    ->where('status', $statusCode);

                // ✅ Apply centralized date filtering
                $query = QueryHelpers::addDateFilters($query, $request, 'date');

                $results[] = (array) $query->first();
            }

            // 🔢 Totals Computation
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

            Log::info("SEF BLDG Total = ₱" . number_format($totals['totalSum'], 2));

            return response()->json([...$results, $totals]);

        } catch (\Exception $e) {
            Log::error("Error fetching SEF building data: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching SEF building data'], 500);
        }
    }
}
