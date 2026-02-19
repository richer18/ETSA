<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class GeneralFundDataServiceUserChargesTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('general_fund_data');

            // Use your helper to add optional date filters
            $query = QueryHelpers::addDateFilters($query, $request);

            // Calculate the total of Service/User Charges
            $result = $query->selectRaw('
                SUM(
                    Police_Report_Clearance +
                    Secretaries_Fee +
                    Med_Dent_Lab_Fees +
                    Garbage_Fees +
                    Cutting_Tree +
                    Doc_Stamp
                ) AS Service_User_Charges
            ')->first();

            return response()->json([
                'service_user_charges' => $result->Service_User_Charges ?? 0
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching Service/User Charges total: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
