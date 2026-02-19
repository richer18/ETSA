<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityTaxCertificateViewDailyCollectionDetailsCedulaController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json(['error' => 'Date is required'], 400);
        }

        try {
            $results = DB::select("
                SELECT
                    DATE_FORMAT(DATEISSUED, '%Y-%m-%d') AS DATE,
                    CTCNO AS `CTC NO`,
                    NULLIF(LOCAL_TIN, '') AS LOCAL,
                    NULLIF(OWNERNAME, '') AS NAME,
                    COALESCE(BASICTAXDUE, 0) AS BASIC,
                    COALESCE(BUSTAXDUE, 0) +
                    COALESCE(SALTAXDUE, 0) +
                    COALESCE(RPTAXDUE, 0) AS TAX_DUE,
                    COALESCE(INTEREST, 0) AS INTEREST,
                    COALESCE(BASICTAXDUE, 0) +
                    (COALESCE(BUSTAXDUE, 0) +
                     COALESCE(SALTAXDUE, 0) +
                     COALESCE(RPTAXDUE, 0)) +
                    COALESCE(INTEREST, 0) AS TOTAL,
                    NULLIF(USERID, '') AS CASHIER,
                    NULLIF(COMMENT, '') AS COMMENT
                FROM cedula
                WHERE DATE(DATEISSUED) = ?
                ORDER BY CTCNO ASC
            ", [$date]);

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error("Database error: " . $e->getMessage());
            return response()->json(['error' => 'Database error'], 500);
        }
    }
}
