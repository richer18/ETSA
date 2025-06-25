<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class RealPropertyTaxDataOverAllTotalBasicAndSEFSharingController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 🔹 BASIC (RPT) - LAND
            $landBasicQuery = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(
                        IFNULL(current_year, 0) - IFNULL(current_discounts, 0) +
                        IFNULL(prev_year, 0) + IFNULL(prior_years, 0) +
                        IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)
                    ) AS total_amount
                ')
                ->where('status', 'LIKE', 'LAND%');

            $landBasicQuery = QueryHelpers::addDateFilters($landBasicQuery, $request, 'date');
            $landBasic = (array) $landBasicQuery->first();

            // 🔹 BASIC (RPT) - BUILDING
            $bldgBasicQuery = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(
                        IFNULL(current_year, 0) - IFNULL(current_discounts, 0) +
                        IFNULL(prev_year, 0) + IFNULL(prior_years, 0) +
                        IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)
                    ) AS total_amount
                ')
                ->whereIn('status', ['MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS']);

            $bldgBasicQuery = QueryHelpers::addDateFilters($bldgBasicQuery, $request, 'date');
            $bldgBasic = (array) $bldgBasicQuery->first();

            // 🔸 SEF - LAND
            $landSEFQuery = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(
                        IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) +
                        IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) +
                        IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)
                    ) AS total_amount
                ')
                ->where('status', 'LIKE', 'LAND%');

            $landSEFQuery = QueryHelpers::addDateFilters($landSEFQuery, $request, 'date');
            $landSEF = (array) $landSEFQuery->first();

            // 🔸 SEF - BUILDING
            $bldgSEFQuery = DB::table('real_property_tax_data')
                ->selectRaw('
                    SUM(
                        IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) +
                        IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) +
                        IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)
                    ) AS total_amount
                ')
                ->whereIn('status', ['MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS']);

            $bldgSEFQuery = QueryHelpers::addDateFilters($bldgSEFQuery, $request, 'date');
            $bldgSEF = (array) $bldgSEFQuery->first();

            // 🧮 Combine everything
            $basicTotal = ($landBasic['total_amount'] ?? 0) + ($bldgBasic['total_amount'] ?? 0);
            $sefTotal   = ($landSEF['total_amount'] ?? 0) + ($bldgSEF['total_amount'] ?? 0);
            $grandTotal = $basicTotal + $sefTotal;

            $result = [
                'category' => 'TOTAL',
                'Grand Total'      => round($grandTotal, 2),
                'Prov’l Share'     => round(($basicTotal * 0.35) + ($sefTotal * 0.50), 2),
                'Mun. Share'       => round(($basicTotal * 0.40) + ($sefTotal * 0.50), 2),
                'Brgy. Share'      => round($basicTotal * 0.25, 2),
            ];

            Log::info("📊 Overall Sharing - RPT + SEF: ₱" . number_format($grandTotal, 2));
            return response()->json([$result]);

        } catch (\Exception $e) {
            Log::error("Error fetching overall total for Basic and SEF Sharing: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching overall total sharing data'], 500);
        }
    }
}
