<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TotalSummaryController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $nextMonth = Carbon::now()->addDays(30);

        // Use 'bplo' connection
        $bploConnection = DB::connection('bplo');

        // Count total records
        $totalRegistered = $bploConnection->table('bplo_records')->count('MCH_NO');

        // Renew: still valid beyond next 30 days
        $totalRenew = $bploConnection->table('bplo_records')
            ->where('RENEW_TO', '>', $nextMonth)
            ->count();

        // Expiry: will expire within next 30 days
        $totalExpiry = $bploConnection->table('bplo_records')
            ->whereBetween('RENEW_TO', [$now, $nextMonth])
            ->count();

        // Expired: already past due
        $totalExpired = $bploConnection->table('bplo_records')
            ->where('RENEW_TO', '<', $now)
            ->count();

        return response()->json([
            'total_registered' => $totalRegistered,
            'total_renew' => $totalRenew,
            'total_expiry' => $totalExpiry,
            'total_expired' => $totalExpired,
        ]);
    }
}
