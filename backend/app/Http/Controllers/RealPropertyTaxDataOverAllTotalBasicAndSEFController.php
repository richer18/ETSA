<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataOverAllTotalBasicAndSEFController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 📦 BASIC - LAND
            $landBasic = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(IFNULL(current_year, 0)) AS current,
                    SUM(IFNULL(current_discounts, 0)) AS discount,
                    SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
                    SUM(IFNULL(current_penalties, 0)) AS penaltiesCurrent,
                    SUM(IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS penaltiesPrior
                ')
                ->where('status', 'LIKE', 'LAND%');
            $landBasic = QueryHelpers::addDateFilters($landBasic, $request, 'date');
            $landBasic = (array) $landBasic->first();

            // 🏢 BASIC - BUILDING
            $bldgBasic = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(IFNULL(current_year, 0)) AS current,
                    SUM(IFNULL(current_discounts, 0)) AS discount,
                    SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
                    SUM(IFNULL(current_penalties, 0)) AS penaltiesCurrent,
                    SUM(IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS penaltiesPrior
                ')
                ->whereIn('status', ['MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS']);
            $bldgBasic = QueryHelpers::addDateFilters($bldgBasic, $request, 'date');
            $bldgBasic = (array) $bldgBasic->first();

            // 🌱 SEF - LAND
            $landSEF = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(IFNULL(additional_current_year, 0)) - SUM(IFNULL(additional_discounts, 0)) AS current,
                    SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS prior,
                    SUM(
                        IFNULL(additional_penalties, 0) +
                        IFNULL(additional_prev_penalties, 0) +
                        IFNULL(additional_prior_penalties, 0)
                    ) AS penalties
                ')
                ->where('status', 'LIKE', 'LAND%');
            $landSEF = QueryHelpers::addDateFilters($landSEF, $request, 'date');
            $landSEF = (array) $landSEF->first();

            // 🏭 SEF - BUILDING
            $bldgSEF = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(IFNULL(additional_current_year, 0)) - SUM(IFNULL(additional_discounts, 0)) AS current,
                    SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS prior,
                    SUM(
                        IFNULL(additional_penalties, 0) +
                        IFNULL(additional_prev_penalties, 0) +
                        IFNULL(additional_prior_penalties, 0)
                    ) AS penalties
                ')
                ->whereIn('status', ['MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS']);
            $bldgSEF = QueryHelpers::addDateFilters($bldgSEF, $request, 'date');
            $bldgSEF = (array) $bldgSEF->first();

            // 🧮 Compute Grand Total
            $grandTotal =
                ($landBasic['current'] ?? 0) - ($landBasic['discount'] ?? 0) +
                ($bldgBasic['current'] ?? 0) - ($bldgBasic['discount'] ?? 0) +
                ($landBasic['prior'] ?? 0) +
                ($bldgBasic['prior'] ?? 0) +
                ($landBasic['penaltiesCurrent'] ?? 0) +
                ($bldgBasic['penaltiesCurrent'] ?? 0) +
                ($landBasic['penaltiesPrior'] ?? 0) +
                ($bldgBasic['penaltiesPrior'] ?? 0) +
                ($landSEF['current'] ?? 0) +
                ($bldgSEF['current'] ?? 0) +
                ($landSEF['prior'] ?? 0) +
                ($bldgSEF['prior'] ?? 0) +
                ($landSEF['penalties'] ?? 0) +
                ($bldgSEF['penalties'] ?? 0);

            $result = [
                'category' => 'TOTAL',
                'Grand Total' => round($grandTotal, 2),
            ];

            Log::info("📊 Overall RPT + SEF Grand Total = ₱" . number_format($grandTotal, 2));
            return response()->json([$result]);

        } catch (\Exception $e) {
            Log::error("❌ Error computing overall total: " . $e->getMessage());
            return response()->json(['error' => 'Error computing overall total'], 500);
        }
    }
}
