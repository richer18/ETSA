<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class RealPropertyTaxControllerTotalFund extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('real_property_tax_data')->select('gf_total');

            // ✅ Apply shared date filters (using 'date' column, or change if needed)
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            $results = $query->get();

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
