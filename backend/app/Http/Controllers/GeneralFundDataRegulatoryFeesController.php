<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\QueryHelpers;

class GeneralFundDataRegulatoryFeesController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Start with query builder for date filtering
            $query = DB::table('general_fund_data');
            $query = QueryHelpers::addDateFilters($query, $request, 'date');

            // Extract raw SQL and bindings to reuse in each subquery
            $baseSql = $query->toSql();
            $bindings = $query->getBindings();

            $unionQuery = "
                SELECT 'Mayors Permit' AS Taxes, SUM(Mayors_Permit) AS Total FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Weighs and Measure', SUM(Weighs_Measure) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Tricycle Operators', SUM(Tricycle_Operators) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Occupation Tax', SUM(Occupation_Tax) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Certificate of Ownership', SUM(Cert_of_Ownership) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Certificate of Transfer', SUM(Cert_of_Transfer) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Cockpit Prov Share', SUM(Cockpit_Prov_Share) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Cockpit Local Share', SUM(Cockpit_Local_Share) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Docking and Mooring Fee', SUM(Docking_Mooring_Fee) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Sultadas', SUM(Sultadas) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Miscellaneous Fees', SUM(Miscellaneous_Fee) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Registration of Birth', SUM(Reg_of_Birth) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Marriage Fees', SUM(Marriage_Fees) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Burial Fee', SUM(Burial_Fees) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Correction of Entry', SUM(Correction_of_Entry) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Fishing Permit Fee', SUM(Fishing_Permit_Fee) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Sale of Agri. Prod', SUM(Sale_of_Agri_Prod) FROM ({$baseSql}) AS t
                UNION ALL
                SELECT 'Sale of Acct Form', SUM(Sale_of_Acct_Form) FROM ({$baseSql}) AS t
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
                ) FROM ({$baseSql}) AS t
            ";

            // Because we use the same baseSql multiple times, we need to merge bindings accordingly
            $finalBindings = array_merge(...array_fill(0, 19, $bindings));

            $results = DB::select($unionQuery, $finalBindings);

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error('Error generating regulatory fees report: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch report'], 500);
        }
    }
}
