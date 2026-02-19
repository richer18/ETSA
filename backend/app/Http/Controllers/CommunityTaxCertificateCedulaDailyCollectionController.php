<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class CommunityTaxCertificateCedulaDailyCollectionController extends Controller
{
    public function index(Request $request)
{
    $subquery = DB::table('cedula')
        ->selectRaw("
            DATE(DATEISSUED) AS issued_date,
            DATE_FORMAT(DATEISSUED, '%b %d, %Y') AS formatted_date,
            BASICTAXDUE,
            SALTAXDUE,
            INTEREST,
            TOTALAMOUNTPAID,
            COMMENT
        ");

    // Apply filters using helper
    \App\Helpers\QueryHelpers::addDateFilters($subquery, $request, 'DATEISSUED');

    // Wrap in outer query for aggregation
    $results = DB::table(DB::raw("({$subquery->toSql()}) as cedula"))
        ->mergeBindings($subquery) // Important to keep bindings
        ->selectRaw("
            formatted_date AS DATE,
            SUM(BASICTAXDUE) AS BASIC,
            SUM(SALTAXDUE) AS TAX_DUE,
            SUM(INTEREST) AS INTEREST,
            SUM(TOTALAMOUNTPAID) AS TOTAL,
            GROUP_CONCAT(DISTINCT COMMENT SEPARATOR '; ') AS COMMENT
        ")
        ->groupBy('issued_date', 'formatted_date')
        ->orderBy('issued_date')
        ->get();

    return response()->json($results);
}
}
