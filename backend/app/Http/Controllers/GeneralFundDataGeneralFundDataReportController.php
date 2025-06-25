<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralFundDataGeneralFundDataReportController extends Controller
{
    public function index(Request $request)
    {
        // Validate request parameters
        $validated = $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:1900|max:2100'
        ]);

        try {
            $results = DB::table('general_fund_data')
                ->whereMonth('date', $validated['month'])
                ->whereYear('date', $validated['year'])
                ->get();

            Log::info('Filtered General Fund Results:', ['results' => $results]);
            return response()->json($results);

        } catch (\Exception $e) {
            Log::error('Error fetching general fund data: ' . $e->getMessage());
            return response()->json([
                'error' => 'Database query failed',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
