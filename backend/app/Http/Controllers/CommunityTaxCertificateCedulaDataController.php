<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityTaxCertificateCedulaDataController extends Controller
{
    public function index()
    {
        try {
            $results = DB::select("
                SELECT
                    CTC_ID AS CTC_ID,
                    DATEISSUED AS DATE,
                    CTCNO AS `CTC NO`,
                    LOCAL_TIN AS LOCAL,
                    OWNERNAME AS NAME,
                    COALESCE(BASICTAXDUE, 0) AS BASIC,
                    COALESCE(BUSTAXDUE, 0) AS BUSTAXDUE,
                    COALESCE(SALTAXDUE, 0) AS SALTAXDUE,
                    COALESCE(RPTAXDUE, 0) AS RPTAXDUE,
                    (
                        COALESCE(BUSTAXDUE, 0) +
                        COALESCE(SALTAXDUE, 0) +
                        COALESCE(RPTAXDUE, 0)
                    ) AS TAX_DUE,
                    COALESCE(INTEREST, 0) AS INTEREST,
                    COALESCE(TOTALAMOUNTPAID, 0) AS TOTALAMOUNTPAID,
                    USERID AS CASHIER,
                    COMMENT AS COMMENT
                FROM
                    cedula
                ORDER BY DATEISSUED DESC, CTC_ID DESC
            ");

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error('Error executing query: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}
