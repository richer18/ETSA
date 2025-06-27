<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class GeneralFundDataServiceUserChargesController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Base query builder with date filters
            $query = DB::table('general_fund_data');
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            // Convert builder to subquery SQL string
            $baseSql = $query->toSql();
            $bindings = $query->getBindings();

            // UNION ALL structure to replicate JS logic
            $sql = "
                SELECT 'Police Report/Clearance' AS Taxes, SUM(0) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Secretary Fee', SUM(Secretaries_Fee + Police_Report_Clearance) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Med./Dent. & Lab. Fees', SUM(Med_Dent_Lab_Fees) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Garbage Fees', SUM(Garbage_Fees) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Cutting Tree', SUM(Cutting_Tree) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Documentary Stamp', SUM(Doc_Stamp) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Overall Total', SUM(
                    Secretaries_Fee +
                    Police_Report_Clearance +
                    Med_Dent_Lab_Fees +
                    Garbage_Fees +
                    Cutting_Tree +
                    Doc_Stamp
                ) AS Total FROM ({$baseSql}) AS t
            ";

            // Run the UNION ALL query with bindings
            $results = DB::select($sql, array_merge($bindings, $bindings, $bindings, $bindings, $bindings, $bindings, $bindings));

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("❌ Error fetching service/user charges: " . $e->getMessage());
            return response()->json(['error' => 'Server error fetching service/user charges'], 500);
        }
    }
}
