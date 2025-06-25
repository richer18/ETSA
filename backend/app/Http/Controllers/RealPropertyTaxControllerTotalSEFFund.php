<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class RealPropertyTaxControllerTotalSEFFund extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('real_property_tax_data')->select('additional_total');

            // Apply optional date filters (replace 'date' if your date column is named differently)
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $results = $query->get();

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching SEF Fund data'], 500);
        }
    }
}
