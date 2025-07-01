<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataAllDataTrustFundController extends Controller
{
    public function index(Request $request)
    {
        try {
            $year  = $request->query('year');
            $month = $request->query('month');
            $day   = $request->query('day');

            // Start base query
            $query = DB::table('trust_fund_data')
                ->selectRaw("
                    DATE_FORMAT(`DATE`, '%b %d, %Y') AS `DATE`,
                    SUM(COALESCE(BUILDING_PERMIT_FEE, 0)) AS BUILDING_PERMIT_FEE,
                    SUM(COALESCE(ELECTRICAL_FEE, 0)) AS ELECTRICAL_FEE,
                    SUM(COALESCE(ZONING_FEE, 0)) AS ZONING_FEE,
                    SUM(COALESCE(LIVESTOCK_DEV_FUND, 0)) AS LIVESTOCK_DEV_FUND,
                    SUM(COALESCE(DIVING_FEE, 0)) AS DIVING_FEE,
                    SUM(COALESCE(TOTAL, 0)) AS TOTAL,
                    GROUP_CONCAT(DISTINCT COMMENTS SEPARATOR '; ') AS COMMENTS
                ")
                ->when($year, fn($q) => $q->whereYear('DATE', $year))
                ->when($month, fn($q) => $q->whereMonth('DATE', $month))
                ->when($day, fn($q) => $q->whereDay('DATE', $day))
                ->groupBy(DB::raw("DATE_FORMAT(`DATE`, '%b %d, %Y')"))
                ->orderBy(DB::raw('DATE(`DATE`)'));

            $results = $query->get();

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Error fetching trust fund data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
