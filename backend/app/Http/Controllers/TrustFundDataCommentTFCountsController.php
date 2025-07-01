<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataCommentTFCountsController extends Controller
{
    public function index()
    {
        try {
            $results = DB::table('tf_comment')
                ->select(
                    DB::raw('DATE_FORMAT(date, "%Y-%m-%d") as formatted_date'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('formatted_date')
                ->get();

            // Convert to associative array (like the JS version)
            $counts = [];
            foreach ($results as $row) {
                $counts[$row->formatted_date] = $row->count;
            }

            return response()->json($counts);
        } catch (\Exception $e) {
            Log::error('Error fetching comment counts: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching comment counts'], 500);
        }
    }
}
