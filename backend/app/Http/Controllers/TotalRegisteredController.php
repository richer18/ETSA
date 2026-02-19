<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TotalRegisteredController extends Controller
{
    // ✅ Returns overall total registered count
    public function index()
    {
        $bplo = DB::connection('bplo'); // Use BPLO DB

        $overallTotal = $bplo->table('bplo_records')->count('MCH_NO');

        return response()->json([
            'overall_registered' => $overallTotal
        ]);
    }

    // ✅ Returns detailed list of all registered records
    public function list()
    {
        $bplo = DB::connection('bplo'); // Use BPLO DB

        $records = $bplo->table('bplo_records')
            ->select(
                'DATE as DATE_REGISTERED',
                DB::raw("CONCAT(FNAME, ' ', COALESCE(MNAME, ''), ' ', LNAME) as NAME"),
                'MCH_NO',
                'FRANCHISE_NO'
            )
            ->orderBy('DATE', 'DESC')
            ->get();

        return response()->json($records);
    }
}
