<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityTaxCertificateSummaryCollectionDataReportController extends Controller
{
    public function index(Request $request)
{
    $month = (int) $request->query('month');
    $year = (int) $request->query('year');

    if (!$month || !$year || $month < 1 || $month > 12) {
        return response()->json(['error' => 'Valid month and year are required'], 400);
    }

    $startDate = sprintf('%04d-%02d-01', $year, $month);
    $endDate = date('Y-m-t', strtotime($startDate));

    try {
        \Log::info("Checking CEDULA summary between $startDate and $endDate");

        $result = DB::selectOne("
            SELECT SUM(BASICTAXDUE + BUSTAXDUE + SALTAXDUE + RPTAXDUE + INTEREST) AS Totalamountpaid
            FROM cedula
            WHERE DATE(DATEISSUED) BETWEEN ? AND ?
        ", [$startDate, $endDate]);

        return response()->json([
            'Totalamountpaid' => $result->Totalamountpaid ?? 0
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching cedula summary data: ' . $e->getMessage());
        return response()->json(['error' => 'Database query failed'], 500);
    }
}
}
