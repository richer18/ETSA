<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TotalTaxCollectedDataController extends Controller
{
    public function monthlyData()
    {
        $months = range(1, 12);
        $year = 2025;

        $result = collect($months)->map(function ($month) use ($year) {
            $cedula = DB::table('cedula')
                ->whereYear('DATEISSUED', $year)
                ->whereMonth('DATEISSUED', $month)
                ->sum('TOTALAMOUNTPAID');

            $general = DB::table('general_fund_data')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('total');

            $real = DB::table('real_property_tax_data')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('total');

            $trust = DB::table('trust_fund_data')
                ->whereYear('DATE', $year)
                ->whereMonth('DATE', $month)
                ->sum('TOTAL');

            return [
                'month' => date('M', mktime(0, 0, 0, $month, 1)),
                'value' => $cedula + $general + $real + $trust,
            ];
        });

        return response()->json($result);
    }
}
