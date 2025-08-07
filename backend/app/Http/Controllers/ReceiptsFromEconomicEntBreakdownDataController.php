<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReceiptsFromEconomicEntBreakdownDataController extends Controller
{
    public function index(Request $request)
    {
        $year = (int) $request->query('year');
        $months = $request->query('months');

        if (!$year || $year < 1000) {
            return response()->json([
                'error' => 'Invalid or missing "year" parameter',
                'code' => 'INVALID_YEAR'
            ], 400);
        }

        $monthList = [];
        if ($months) {
            $monthList = array_filter(
                array_map('intval', explode(',', $months)),
                fn($m) => $m >= 1 && $m <= 12
            );
        }

        $query = DB::table('general_fund_data')
            ->selectRaw("
                SUM(COALESCE(Slaughter_House_Fee, 0)) AS Slaughter_House_Fee,
                SUM(COALESCE(Stall_Fees, 0)) AS Stall_Fees,
                SUM(COALESCE(Cash_Tickets, 0)) AS Cash_Tickets,
                SUM(COALESCE(Water_Fees, 0)) AS Water_Fees,
                SUM(COALESCE(Rental_of_Equipment, 0)) AS Rental_of_Equipment
            ")
            ->whereYear('date', $year);

        if (!empty($monthList)) {
            $query->whereIn(DB::raw('MONTH(date)'), $monthList);
        }

        try {
            $result = $query->first();

            $response = [
                'Slaughterhouse Operations'      => $result->Slaughter_House_Fee ?? 0,
                'Market Operations'              => ($result->Stall_Fees ?? 0) + ($result->Cash_Tickets ?? 0),
                'Water Work System Operations'   => $result->Water_Fees ?? 0,
                'Lease/Rental Facilities'        => $result->Rental_of_Equipment ?? 0,
            ];

            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('DB error in ReceiptsFromEconomicEntBreakdownDataController: ' . $e->getMessage());

            return response()->json([
                'error' => 'Internal server error',
                'code' => 'DB_ERROR'
            ], 500);
        }
    }
}
