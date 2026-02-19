<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralFundDataRegulatoryFeesController extends Controller
{
    public function index(Request $request)
    {
        try {
            $year = $request->input('year');
            $month = $request->input('month');
            $day = $request->input('day');

            // Base query builder
            $filters = [];
            $bindings = [];

            if ($year) {
                $filters[] = 'YEAR(date) = ?';
                $bindings[] = $year;
            }
            if ($month) {
                $filters[] = 'MONTH(date) = ?';
                $bindings[] = $month;
            }
            if ($day) {
                $filters[] = 'DAY(date) = ?';
                $bindings[] = $day;
            }

            $whereClause = '';
            if (count($filters) > 0) {
                $whereClause = 'WHERE ' . implode(' AND ', $filters);
            }

            // SQL equivalent of your JS
            $sql = "
                SELECT 'Mayors Permit' AS Taxes, SUM(Mayors_Permit) AS Total FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Weighs and Measure', SUM(Weighs_Measure) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Tricycle Operators', SUM(Tricycle_Operators) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Occupation Tax', SUM(Occupation_Tax) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Certificate of Ownership', SUM(Cert_of_Ownership) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Certificate of Transfer', SUM(Cert_of_Transfer) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Cockpit Prov Share', SUM(Cockpit_Prov_Share) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Cockpit Local Share', SUM(Cockpit_Local_Share) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Docking and Mooring Fee', SUM(Docking_Mooring_Fee) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Sultadas', SUM(Sultadas) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Miscellaneous Fees', SUM(Miscellaneous_Fee) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Registration of Birth', SUM(Reg_of_Birth) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Marriage Fees', SUM(Marriage_Fees) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Burial Fee', SUM(Burial_Fees) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Correction of Entry', SUM(Correction_of_Entry) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Fishing Permit Fee', SUM(Fishing_Permit_Fee) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Sale of Agri. Prod', SUM(Sale_of_Agri_Prod) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Sale of Acct Form', SUM(Sale_of_Acct_Form) FROM general_fund_data $whereClause
                UNION ALL
                SELECT 'Overall Total', SUM(
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
                ) FROM general_fund_data $whereClause
            ";

            // Execute with bindings
            $results = DB::select($sql, $bindings);

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Error fetching General Fund Regulatory Fees Report: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
