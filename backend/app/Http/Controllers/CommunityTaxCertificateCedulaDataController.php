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
                    DATEISSUED AS DATE,
                    CTCNO AS `CTC NO`,
                    LOCAL_TIN AS LOCAL,
                    OWNERNAME AS NAME,
                    BASICTAXDUE AS BASIC,
                    BUSTAXAMOUNT AS BUSTAXAMOUNT,
                    BUSTAXDUE AS BUSTAXDUE,
                    SALTAXAMOUNT AS SALTAXAMOUNT,
                    SALTAXDUE AS SALTAXDUE,
                    RPTAXAMOUNT AS RPTAXAMOUNT,
                    RPTAXDUE AS RPTAXDUE,
                    (BUSTAXDUE + SALTAXDUE + RPTAXDUE) AS TAX_DUE,
                    INTEREST AS INTEREST,
                    (BASICTAXDUE + BUSTAXDUE + SALTAXDUE + RPTAXDUE + INTEREST) AS TOTALAMOUNTPAID,
                    USERID AS CASHIER,
                    COMMENT AS COMMENTS
                FROM
                    cedula
            ");

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error('Error executing query: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}
