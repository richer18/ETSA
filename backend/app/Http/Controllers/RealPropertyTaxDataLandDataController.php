<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataLandDataController extends Controller
{
    public function index(Request $request)
    {
        try {
            $categories = [
                'LAND-AGRI'   => 'AGRI',
                'LAND-RES'    => 'RES',
                'LAND-COMML'  => 'COMML',
                'SPECIAL'     => 'SPECIAL'
            ];

            $results = [];

            foreach ($categories as $statusCode => $label) {
                $query = DB::table('real_property_tax_data')
                    ->selectRaw('? AS category', [$label])
                    ->selectRaw('IFNULL(SUM(current_year), 0) AS current')
                    ->selectRaw('IFNULL(SUM(current_discounts), 0) AS discount')
                    ->selectRaw('IFNULL(SUM(prev_year), 0) + IFNULL(SUM(prior_years), 0) AS prior')
                    ->selectRaw('IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent')
                    ->selectRaw('IFNULL(SUM(prev_penalties), 0) + IFNULL(SUM(prior_penalties), 0) AS penaltiesPrior')
                    ->where('status', $statusCode);

                $query = QueryHelpers::addDateFilters($query, $request, 'date');

                $results[] = (array) $query->first();
            }

            // Calculate grand total row
            $totals = [
                'category' => 'TOTAL',
                'current' => 0,
                'discount' => 0,
                'prior' => 0,
                'penaltiesCurrent' => 0,
                'penaltiesPrior' => 0,
                'totalSum' => 0
            ];

            foreach ($results as $row) {
                $totals['current']          += (float) $row['current'];
                $totals['discount']         += (float) $row['discount'];
                $totals['prior']            += (float) $row['prior'];
                $totals['penaltiesCurrent'] += (float) $row['penaltiesCurrent'];
                $totals['penaltiesPrior']   += (float) $row['penaltiesPrior'];
            }

            $totals['totalSum'] =
                $totals['current'] -
                $totals['discount'] +
                $totals['prior'] +
                $totals['penaltiesCurrent'] +
                $totals['penaltiesPrior'];

            Log::info("🧾 Total Land Data Sum = ₱" . number_format($totals['totalSum'], 2));

            return response()->json([...$results, $totals]);

        } catch (\Exception $e) {
            Log::error('❌ Error fetching land data: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching land data'], 500);
        }
    }
}
