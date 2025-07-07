<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrustFundDataReportDataController extends Controller
{
    public function index(Request $request)
    {
        $month = (int) $request->query('month');
        $year = (int) $request->query('year');

        // Basic validation
        if (!$month || !$year) {
            return response()->json(['error' => 'Valid month and year are required'], 400);
        }

        try {
            $results = DB::table('trust_fund_data')
                ->whereMonth('DATE', $month)
                ->whereYear('DATE', $year)
                ->get();

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Database query failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
