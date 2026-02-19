<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataCommentRPTCountsController extends Controller
{
    public function index()
    {
        try {
            $results = DB::select("
                SELECT DATE_FORMAT(date, '%Y-%m-%d') AS formatted_date, COUNT(*) AS count
                FROM rpt_comment
                GROUP BY formatted_date
            ");

            $counts = [];
            foreach ($results as $row) {
                $counts[$row->formatted_date] = $row->count;
            }

            return response()->json($counts);
        } catch (\Exception $e) {
            Log::error("Error fetching RPT comment counts: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching comment counts'], 500);
        }
    }
}
