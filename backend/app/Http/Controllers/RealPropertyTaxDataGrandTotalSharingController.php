<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataGrandTotalSharingController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Base queries for Land and Building
            $landQuery = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS current,
                    SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
                    SUM(IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS penalties
                ')
                ->where('status', 'LIKE', 'LAND%');

            $buildingQuery = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS current,
                    SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
                    SUM(IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS penalties
                ')
                ->whereIn('status', ['MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS']);

            // Apply reusable date filter helper
            $landQuery = QueryHelpers::addDateFilters($landQuery, $request, 'date');
            $buildingQuery = QueryHelpers::addDateFilters($buildingQuery, $request, 'date');

            $landData = (array) $landQuery->first();
            $bldgData = (array) $buildingQuery->first();

            // Ensure all values exist
            $land = [
                'current'   => $landData['current'] ?? 0,
                'prior'     => $landData['prior'] ?? 0,
                'penalties' => $landData['penalties'] ?? 0,
            ];

            $bldg = [
                'current'   => $bldgData['current'] ?? 0,
                'prior'     => $bldgData['prior'] ?? 0,
                'penalties' => $bldgData['penalties'] ?? 0,
            ];

            // Compute grand total
            $grandTotal = $land['current'] + $land['prior'] + $land['penalties']
                        + $bldg['current'] + $bldg['prior'] + $bldg['penalties'];

            $result = [
                'category' => 'TOTAL',
                'Grand Total'           => round($grandTotal, 2),
                '35% Prov’l Share'      => round($grandTotal * 0.35, 2),
                '40% Mun. Share'        => round($grandTotal * 0.40, 2),
                '25% Brgy. Share'       => round($grandTotal * 0.25, 2),
            ];

            Log::info("🏛 Grand Total Sharing: ₱" . number_format($grandTotal, 2));

            return response()->json([$result]);

        } catch (\Exception $e) {
            Log::error("Error fetching grand total sharing: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching grand total sharing data'], 500);
        }
    }
}
