<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class GeneralFundDataReceiptsFromEconomicEnterprisesTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('general_fund_data');

            // Apply your reusable date filters
            $query = QueryHelpers::addDateFilters($query, $request);

            // SUM the relevant fields
            $result = $query->selectRaw('
                SUM(
                    Slaughter_House_Fee +
                    Stall_Fees +
                    Water_Fees +
                    Rental_of_Equipment
                ) AS Receipts_From_Economic_Enterprises
            ')->first();

            return response()->json([
                'receipts_from_economic_enterprises' => $result->Receipts_From_Economic_Enterprises ?? 0
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching Receipts from Economic Enterprises total: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
