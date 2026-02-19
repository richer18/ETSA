<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class GeneralFundDataTaxOnBusinessTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('general_fund_data');

            // Apply date filters using your helper
            $query = QueryHelpers::addDateFilters($query, $request);

            // Perform the SUM of the specific columns
            $result = $query->selectRaw('
                SUM(
                    Manufacturing +
                    Distributor +
                    Retailing +
                    Financial +
                    Other_Business_Tax +
                    Sand_Gravel +
                    Fines_Penalties
                ) AS Tax_On_Business
            ')->first();

            return response()->json([
                'tax_on_business' => $result->Tax_On_Business ?? 0
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching Tax on Business total: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
