<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelpers;

class GeneralFundDataRegulatoryFeesTotalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = DB::table('general_fund_data');

            // Apply your reusable date filters
            $query = QueryHelpers::addDateFilters($query, $request);

            // Perform SUM of 18 columns
            $result = $query->selectRaw('
                SUM(
                    Mayors_Permit +
                    Weighs_Measure +
                    Tricycle_Operators +
                    Occupation_Tax +
                    Cert_of_Ownership +
                    Cert_of_Transfer +
                    Cockpit_Prov_Share +
                    Cockpit_Local_Share +
                    Docking_Mooring_Fee +
                    Sultadas +
                    Miscellaneous_Fee +
                    Reg_of_Birth +
                    Marriage_Fees +
                    Burial_Fees +
                    Correction_of_Entry +
                    Fishing_Permit_Fee +
                    Sale_of_Agri_Prod +
                    Sale_of_Acct_Form
                ) AS Regulatory_Fees
            ')->first();

            return response()->json([
                'regulatory_fees' => $result->Regulatory_Fees ?? 0
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching Regulatory Fees total: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
