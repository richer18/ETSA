<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralFundDataViewalldataGeneralFundTableViewController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json(['error' => 'Date parameter is required'], 400);
        }

        try {
            $results = DB::table('general_fund_data')
                ->select(
                    'id',
                    'date',
                    'name',
                    'receipt_no',
                    'Manufacturing',
                    'Distributor',
                    'Retailing',
                    'Financial',
                    'Other_Business_Tax',
                    'Sand_Gravel',
                    'Fines_Penalties',
                    'Mayors_Permit',
                    'Weighs_Measure',
                    'Tricycle_Operators',
                    'Occupation_Tax',
                    'Cert_of_Ownership',
                    'Cert_of_Transfer',
                    'Cockpit_Prov_Share',
                    'Cockpit_Local_Share',
                    'Docking_Mooring_Fee',
                    'Sultadas',
                    'Miscellaneous_Fee',
                    'Reg_of_Birth',
                    'Marriage_Fees',
                    'Burial_Fees',
                    'Correction_of_Entry',
                    'Fishing_Permit_Fee',
                    'Sale_of_Agri_Prod',
                    'Sale_of_Acct_Form',
                    'Water_Fees',
                    'Stall_Fees',
                    'Cash_Tickets',
                    'Slaughter_House_Fee',
                    'Rental_of_Equipment',
                    'Doc_Stamp',
                    'Police_Report_Clearance',
                    'Secretaries_Fee',
                    'Med_Dent_Lab_Fees',
                    'Garbage_Fees',
                    'Cutting_Tree',
                    'total',
                    'cashier',
                    'type_receipt',
                    'comments'
                )
                ->whereDate('date', '=', $date)
                ->orderBy('id', 'asc')
                ->get();

            if ($results->isEmpty()) {
                return response()->json(['message' => 'No data found for the given date'], 404);
            }

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("Error fetching general fund rows for table view: " . $e->getMessage());
            return response()->json(['error' => 'Database query error'], 500);
        }
    }
}
