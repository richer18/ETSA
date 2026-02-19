<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class RealPropertyTaxController extends Controller
{
    public function allData(): JsonResponse
    {
        try {
            $results = DB::table('real_property_tax_data')->get();
            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
