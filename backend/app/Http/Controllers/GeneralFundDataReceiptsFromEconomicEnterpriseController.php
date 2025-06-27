<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class GeneralFundDataReceiptsFromEconomicEnterpriseController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Base WHERE clause generation
            $conditions = [];
            $bindings = [];

            if ($request->filled('year')) {
                $conditions[] = 'YEAR(`date`) = ?';
                $bindings[] = $request->year;
            }
            if ($request->filled('month')) {
                $conditions[] = 'MONTH(`date`) = ?';
                $bindings[] = $request->month;
            }
            if ($request->filled('day')) {
                $conditions[] = 'DAY(`date`) = ?';
                $bindings[] = $request->day;
            }

            $whereClause = count($conditions) > 0 ? 'WHERE ' . implode(' AND ', $conditions) : '';

            // Raw SQL (UNION ALL with optional WHERE)
            $sql = "
                SELECT 'Water Fees' AS Taxes, SUM(Water_Fees) AS Total FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Stall Fees', SUM(Stall_Fees) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Cash Tickets', SUM(Cash_Tickets) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Slaughter House Fee', SUM(Slaughter_House_Fee) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Rental of Equipment', SUM(Rental_of_Equipment) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Overall Total', SUM(
                    Water_Fees +
                    Stall_Fees +
                    Cash_Tickets +
                    Slaughter_House_Fee +
                    Rental_of_Equipment
                ) AS Total FROM general_fund_data $whereClause
            ";

            $results = DB::select($sql, array_merge($bindings, $bindings, $bindings, $bindings, $bindings, $bindings)); // 6 blocks using same bindings

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("Error fetching economic enterprise receipts report: " . $e->getMessage());
            return response()->json(['error' => 'Database query failed'], 500);
        }
    }
}
