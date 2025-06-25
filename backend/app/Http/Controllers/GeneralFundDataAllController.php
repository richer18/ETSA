<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GeneralFundDataAllController extends Controller
{
    public function index()
    {
        try {
            $results = DB::table('general_fund_data')->get();
            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error("Error fetching data: " . $e->getMessage());
            return response()->json(['error' => 'Database query failed'], 500);
        }
    }
}
