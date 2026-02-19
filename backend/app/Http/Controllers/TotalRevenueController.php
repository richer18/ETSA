<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TotalRevenueController extends Controller
{
    /**
     * 🗓️ Get total revenue per year
     */
    public function yearly()
    {
        $bplo = DB::connection('bplo'); // Use BPLO DB

        $yearlyTotals = $bplo->table('bplo_records')
            ->selectRaw('YEAR(PAYMENT_DATE) as year, SUM(AMOUNT) as total')
            ->groupBy(DB::raw('YEAR(PAYMENT_DATE)'))
            ->orderBy('year', 'DESC')
            ->get();

        return response()->json($yearlyTotals);
    }

    /**
     * 💰 Get overall total revenue
     */
    public function overall()
    {
        $bplo = DB::connection('bplo'); // Use BPLO DB

        $overallTotal = $bplo->table('bplo_records')->sum('AMOUNT');

        return response()->json([
            'overall_total' => $overallTotal
        ]);
    }
}
