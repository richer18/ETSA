<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TotalExpiredController extends Controller
{
    public function index()
    {
        $bplo = DB::connection('bplo'); // Use BPLO DB
        
        $today = Carbon::today();

        // Count all records with RENEW_TO before today
        $expiredCount = $bplo->table('bplo_records')
            ->whereDate('RENEW_TO', '<', $today)
            ->count();

        return response()->json([
            'overall_expired' => $expiredCount
        ]);
    }
}
