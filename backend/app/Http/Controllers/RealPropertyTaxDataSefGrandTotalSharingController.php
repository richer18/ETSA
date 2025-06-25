<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataSefGrandTotalSharingController extends Controller
{
    public function index(Request $request)
    {
        try {
            // LAND query
            $landQuery = DB::table('real_property_tax_data')
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

            $landQuery = QueryHelpers::addDateFilters($landQuery, $request, 'date');

            // BUILDING query
            $buildingQuery = DB::table('real_property_tax_data')
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

            $buildingQuery = QueryHelpers::addDateFilters($buildingQuery, $request, 'date');

            $landData = (array) $landQuery->first();
            $buildingData = (array) $buildingQuery->first();

            $land = [
                'current' => $landData['current'] ?? 0,
                'prior' => $landData['prior'] ?? 0,
                'penalties' => $landData['penalties'] ?? 0,
            ];

            $building = [
                'current' => $buildingData['current'] ?? 0,
                'prior' => $buildingData['prior'] ?? 0,
                'penalties' => $buildingData['penalties'] ?? 0,
            ];

            $grandTotal =
                $land['current'] + $land['prior'] + $land['penalties'] +
                $building['current'] + $building['prior'] + $building['penalties'];

            $result = [
                'category' => 'TOTAL',
                'Grand Total' => round($grandTotal, 2),
                '50% Prov’l Share' => round($grandTotal * 0.50, 2),
                '50% Mun. Share' => round($grandTotal * 0.50, 2),
            ];

            Log::info("✅ SEF Grand Total: ₱" . number_format($grandTotal, 2));

            return response()->json([$result]);

        } catch (\Exception $e) {
            Log::error('❌ Error fetching SEF grand total sharing: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching SEF grand total sharing data'], 500);
        }
    }
}
