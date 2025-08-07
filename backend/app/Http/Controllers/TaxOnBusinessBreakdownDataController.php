<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaxOnBusinessBreakdownDataController extends Controller
{
    public function index(Request $request)
    {
        try {
            $year = (int) $request->query('year');
            $months = $request->query('months');

            $monthList = $months ? array_map('intval', explode(',', $months)) : [];

            $query = DB::table('general_fund_data')
                ->select(
                    DB::raw('SUM(Manufacturing) as Manufacturing'),
                    DB::raw('SUM(Distributor) as Distributor'),
                    DB::raw('SUM(Retailing) as Retailing'),
                    DB::raw('SUM(Financial) as Financial'),
                    DB::raw('SUM(Other_Business_Tax) as Other_Business_Tax'),
                    DB::raw('SUM(Sand_Gravel) as Sand_Gravel'),
                    DB::raw('SUM(Fines_Penalties) as Fines_Penalties')
                );

            if ($year) {
                $query->whereYear('date', $year);
            }

            if (!empty($monthList)) {
                $query->whereIn(DB::raw('MONTH(date)'), $monthList);
            }

            $result = $query->first();

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error("Error in TaxOnBusinessBreakdown: " . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}
