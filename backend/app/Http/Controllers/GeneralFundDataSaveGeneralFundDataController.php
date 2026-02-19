<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralFundDataSaveGeneralFundDataController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->only([
            'date', 'name', 'receipt_no',
            'Manufacturing', 'Distributor', 'Retailing', 'Financial', 'Other_Business_Tax',
            'Sand_Gravel', 'Fines_Penalties', 'Mayors_Permit', 'Weighs_Measure', 'Tricycle_Operators',
            'Occupation_Tax', 'Cert_of_Ownership', 'Cert_of_Transfer', 'Cockpit_Prov_Share',
            'Cockpit_Local_Share', 'Docking_Mooring_Fee', 'Sultadas', 'Miscellaneous_Fee',
            'Reg_of_Birth', 'Marriage_Fees', 'Burial_Fees', 'Correction_of_Entry',
            'Fishing_Permit_Fee', 'Sale_of_Agri_Prod', 'Sale_of_Acct_Form', 'Water_Fees',
            'Stall_Fees', 'Cash_Tickets', 'Slaughter_House_Fee', 'Rental_of_Equipment',
            'Doc_Stamp', 'Police_Report_Clearance', 'Secretaries_Fee', 'Med_Dent_Lab_Fees',
            'Garbage_Fees', 'Cutting_Tree', 'total', 'cashier', 'type_receipt'
        ]);

        try {
            // 1. Check if receipt_no already exists
            $exists = DB::table('general_fund_data')
                ->where('receipt_no', $data['receipt_no'])
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Receipt number already exists'], 400);
            }

            // 2. Insert new data
            DB::table('general_fund_data')->insert($data);

            return response()->json(['message' => 'Data saved successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to save General Fund data: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save data'], 500);
        }
    }
}
