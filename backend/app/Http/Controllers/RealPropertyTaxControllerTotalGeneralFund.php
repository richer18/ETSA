<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class RealPropertyTaxControllerTotalGeneralFund extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('real_property_tax_data')->select('total');

            // Use shared date filter helper (adjust 'date' to your actual date column)
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $results = $query->get();

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching General Fund data'], 500);
        }
    }
}
