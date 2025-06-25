<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralFundDataAllDataGeneralFundController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        $day = $request->query('day');

        try {
            $sql = "
                SELECT
                DATE_FORMAT(g.date, '%b %d, %Y') AS `DATE`,

                -- Tax on Business
                SUM(
                    IFNULL(g.Manufacturing, 0)
                    + IFNULL(g.Distributor, 0)
                    + IFNULL(g.Retailing, 0)
                    + IFNULL(g.Financial, 0)
                    + IFNULL(g.Other_Business_Tax, 0)
                    + IFNULL(g.Sand_Gravel, 0)
                    + IFNULL(g.Fines_Penalties, 0)
                    ) AS `Tax on Business`,

                    -- Regulatory Fees
                    SUM(
                    IFNULL(g.Mayors_Permit, 0)
                    + IFNULL(g.Weighs_Measure, 0)
                    + IFNULL(g.Tricycle_Operators, 0)
                    + IFNULL(g.Occupation_Tax, 0)
                    + IFNULL(g.Cert_of_Ownership, 0)
                    + IFNULL(g.Cert_of_Transfer, 0)
                    + IFNULL(g.Cockpit_Prov_Share, 0)
                    + IFNULL(g.Cockpit_Local_Share, 0)
                    + IFNULL(g.Docking_Mooring_Fee, 0)
                    + IFNULL(g.Sultadas, 0)
                    + IFNULL(g.Miscellaneous_Fee, 0)
                    + IFNULL(g.Reg_of_Birth, 0)
                    + IFNULL(g.Marriage_Fees, 0)
                    + IFNULL(g.Burial_Fees, 0)
                    + IFNULL(g.Correction_of_Entry, 0)
                    + IFNULL(g.Fishing_Permit_Fee, 0)
                    + IFNULL(g.Sale_of_Agri_Prod, 0)
                    + IFNULL(g.Sale_of_Acct_Form, 0)
                    ) AS `Regulatory Fees`,

                    -- Receipts from Economic Enterprise
                    SUM(
                    IFNULL(g.Water_Fees, 0)
                    + IFNULL(g.Stall_Fees, 0)
                    + IFNULL(g.Cash_Tickets, 0)
                    + IFNULL(g.Slaughter_House_Fee, 0)
                    + IFNULL(g.Rental_of_Equipment, 0)
                    + IFNULL(g.Cutting_Tree, 0)
                    ) AS `Receipts From Economic Enterprise`,

                    -- Service/User Charges
                    SUM(
                    IFNULL(g.Doc_Stamp, 0)
                    + IFNULL(g.Police_Report_Clearance, 0)
                    + IFNULL(g.Secretaries_Fee, 0)
                    + IFNULL(g.Med_Dent_Lab_Fees, 0)
                    + IFNULL(g.Garbage_Fees, 0)
                    ) AS `Service/User Charges`,

                    -- Overall Total
                    SUM(
                    IFNULL(g.Manufacturing, 0) + IFNULL(g.Distributor, 0) + IFNULL(g.Retailing, 0) + IFNULL(g.Financial, 0)
                    + IFNULL(g.Other_Business_Tax, 0) + IFNULL(g.Sand_Gravel, 0) + IFNULL(g.Fines_Penalties, 0)
                    + IFNULL(g.Mayors_Permit, 0) + IFNULL(g.Weighs_Measure, 0) + IFNULL(g.Tricycle_Operators, 0)
                    + IFNULL(g.Occupation_Tax, 0) + IFNULL(g.Cert_of_Ownership, 0) + IFNULL(g.Cert_of_Transfer, 0)
                    + IFNULL(g.Cockpit_Prov_Share, 0) + IFNULL(g.Cockpit_Local_Share, 0) + IFNULL(g.Docking_Mooring_Fee, 0)
                    + IFNULL(g.Sultadas, 0) + IFNULL(g.Miscellaneous_Fee, 0) + IFNULL(g.Reg_of_Birth, 0)
                    + IFNULL(g.Marriage_Fees, 0) + IFNULL(g.Burial_Fees, 0) + IFNULL(g.Correction_of_Entry, 0)
                    + IFNULL(g.Fishing_Permit_Fee, 0) + IFNULL(g.Sale_of_Agri_Prod, 0) + IFNULL(g.Sale_of_Acct_Form, 0)
                    + IFNULL(g.Water_Fees, 0) + IFNULL(g.Stall_Fees, 0) + IFNULL(g.Cash_Tickets, 0)
                    + IFNULL(g.Slaughter_House_Fee, 0) + IFNULL(g.Rental_of_Equipment, 0) + IFNULL(g.Doc_Stamp, 0)
                    + IFNULL(g.Police_Report_Clearance, 0) + IFNULL(g.Secretaries_Fee, 0) + IFNULL(g.Med_Dent_Lab_Fees, 0)
                    + IFNULL(g.Garbage_Fees, 0) + IFNULL(g.Cutting_Tree, 0)
                    ) AS `Overall Total`,

                    GROUP_CONCAT(DISTINCT g.comments SEPARATOR '; ') AS REMARKS,
                    'VIEW COMMENT' AS ACTION

                FROM general_fund_data AS g
            ";

            $conditions = [];
            if ($year) {
                $conditions[] = "YEAR(g.date) = " . DB::getPdo()->quote($year);
            }
            if ($month) {
                $conditions[] = "MONTH(g.date) = " . DB::getPdo()->quote($month);
            }
            if ($day) {
                $conditions[] = "DAY(g.date) = " . DB::getPdo()->quote($day);
            }

            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }

            $sql .= " GROUP BY g.date ORDER BY g.date;";

            $results = DB::select($sql);

            return response()->json($results);
        } catch (\Exception $e) {
            Log::error("Failed to fetch general fund summary: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
}
