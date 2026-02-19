<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class GeneralFundTotalTaxReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $groups = [
                'Tax on Business' => [
                    'Manufacturing','Distributor','Retailing','Financial','Other_Business_Tax','Fines_Penalties','Sand_Gravel'
                ],
                'Regulatory Fees' => [
                    'Weighs_Measure','Tricycle_Operators','Occupation_Tax','Cert_of_Ownership','Cert_of_Transfer',
                    'Cockpit_Prov_Share','Cockpit_Local_Share','Docking_Mooring_Fee','Sultadas','Miscellaneous_Fee',
                    'Reg_of_Birth','Marriage_Fees','Burial_Fees','Correction_of_Entry','Fishing_Permit_Fee',
                    'Sale_of_Agri_Prod','Sale_of_Acct_Form'
                ],
                'Receipts From Economic Enterprise' => [
                    'Water_Fees','Stall_Fees','Cash_Tickets','Slaughter_House_Fee','Rental_of_Equipment'
                ],
                'Service/User Charges' => [
                    'Police_Report_Clearance','Secretaries_Fee','Med_Dent_Lab_Fees','Garbage_Fees','Cutting_Tree','Doc_Stamp'
                ]
            ];

            $subQueries = [];

            foreach ($groups as $label => $cols) {
                $sumExpr = implode(' + ', array_map(fn($c) => "`$c`", $cols));
                $q = DB::table('general_fund_data')
                    ->selectRaw('? as Taxes, SUM(' . $sumExpr . ') as Total', [$label]);
                $q = QueryHelpers::addDateFilters($q, $request, 'date');
                $subQueries[] = $q;
            }

            // Overall Total
            $allCols = array_merge(...array_values($groups));
            $allExpr = implode(' + ', array_map(fn($c) => "`$c`", $allCols));
            $overallQ = DB::table('general_fund_data')
                ->selectRaw('? as Taxes, SUM(' . $allExpr . ') as Total', ['Overall Total']);
            $overallQ = QueryHelpers::addDateFilters($overallQ, $request, 'date');
            $subQueries[] = $overallQ;

            // Combine with UNION ALL
            $master = array_shift($subQueries);
            foreach ($subQueries as $sq) {
                $master = $master->unionAll($sq);
            }

            $results = $master->get();
            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("Error generating total tax report: ".$e->getMessage());
            return response()->json(['error'=>'Server error generating report'], 500);
        }
    }
}
