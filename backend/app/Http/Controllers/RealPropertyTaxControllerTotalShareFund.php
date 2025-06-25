<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class RealPropertyTaxControllerTotalShareFund extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('real_property_tax_data')->select('share');

            // Use your shared helper to filter by month/day/year
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $results = $query->get();

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching Share Fund data'], 500);
        }
    }
}
