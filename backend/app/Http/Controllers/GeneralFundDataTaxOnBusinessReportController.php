<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class GeneralFundDataTaxOnBusinessReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Start with base query builder and apply date filters
            $baseQuery = DB::table('general_fund_data');
            $baseQuery = QueryHelpers::addDateFilters($baseQuery, $request, 'date');
            $sqlBase = $baseQuery->toSql();
            $bindings = $baseQuery->getBindings();

            // Build final union SQL using the baseQuery
            $sql = "
                SELECT 'Manufacturing' AS Taxes, SUM(Manufacturing) AS Total FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Distributor', SUM(Distributor) FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Retailing', SUM(Retailing) FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Financial', SUM(Financial) FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Other Business Tax', SUM(Other_Business_Tax) FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Fines Penalties', SUM(Fines_Penalties) FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Sand Gravel', SUM(Sand_Gravel) FROM ({$sqlBase}) AS t
                UNION ALL
                SELECT 'Overall Total', SUM(
                    Manufacturing +
                    Distributor +
                    Retailing +
                    Financial +
                    Other_Business_Tax +
                    Fines_Penalties +
                    Sand_Gravel
                ) FROM ({$sqlBase}) AS t
            ";

            // Since we're using the same base query multiple times, duplicate bindings
            $bindings = array_merge(
                $bindings, $bindings, $bindings, $bindings,
                $bindings, $bindings, $bindings, $bindings
            );

            $results = DB::select($sql, $bindings);
            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('❌ Error fetching tax-on-business report: ' . $e->getMessage());
            return response()->json(['error' => 'Database query failed'], 500);
        }
    }
}
