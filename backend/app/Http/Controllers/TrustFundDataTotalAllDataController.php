<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataTotalAllDataController extends Controller
{
    public function index()
    {
        try {
            $result = DB::table('trust_fund_data')
                        ->select(DB::raw('SUM(`TOTAL`) AS overall_total'))
                        ->get();

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error("Error fetching trust fund total: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
