<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TotalRenewController extends Controller
{
    // ✅ Function 1: Get total count of renewals
    public function index()
    {
        $today = Carbon::now();
        $nextMonth = $today->copy()->addDays(30);

        $bplo = DB::connection('bplo'); // Use BPLO DB

        // Count renewals valid beyond next 30 days
        $totalRenew = $bplo->table('bplo_records')
            ->where('RENEW_TO', '>', $nextMonth)
            ->count();

        return response()->json([
            'overall_renew' => (int) $totalRenew,
            'as_of' => $today->format('Y-m-d'),
        ]);
    }

    // ✅ Function 2: Get list of renewed applicants
    public function list()
    {
        $today = Carbon::now();
        $nextMonth = $today->copy()->addDays(30);

        $bplo = DB::connection('bplo'); // Use BPLO DB

        // ✅ Use PAYMENT_DATE if available, otherwise fallback to created_at
        $hasDateRegistered = $bplo->getSchemaBuilder()->hasColumn('bplo_records', 'PAYMENT_DATE');
        $dateColumn = $hasDateRegistered ? 'PAYMENT_DATE' : 'created_at';

        // ✅ Handle cases where MNAME is NULL or empty
        $renewedApplicants = $bplo->table('bplo_records')
            ->select(
                "$dateColumn as PAYMENT_DATE",
                DB::raw("
                    CONCAT(
                        FNAME,
                        CASE 
                            WHEN MNAME IS NOT NULL AND MNAME != '' THEN CONCAT(' ', MNAME, ' ') 
                            ELSE ' ' 
                        END,
                        LNAME
                    ) AS NAME
                "),
                'MCH_NO',
                'FRANCHISE_NO',
                'RENEW_FROM',
                'RENEW_TO'
            )
            ->where('RENEW_TO', '>', $nextMonth)
            ->orderBy('RENEW_TO', 'asc')
            ->get();

        return response()->json($renewedApplicants);
    }
}
