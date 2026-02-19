<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UpdateReportDataController extends Controller
{
    public function updateReport(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'dueFrom' => 'nullable|numeric',
            'comment' => 'nullable|string',
        ]);

        try {
            $date = $request->input('date');
            $dueFrom = $request->input('dueFrom', 0);
            $comment = $request->input('comment', '');

            $affected = DB::table('full_report_rcd')
                ->where('date', $date)
                ->update([
                    'dueFrom' => $dueFrom,
                    'comment' => $comment,
                ]);

            if ($affected === 0) {
                return response()->json([
                    'error' => "No record found for the given date",
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => "Record updated successfully",
            ]);

        } catch (\Exception $e) {
            \Log::error("❌ Database update error: " . $e->getMessage());
            return response()->json([
                'error' => "Database update failed",
            ], 500);
        }
    }
}
