<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaveAdjustmentDataController extends Controller
{
    public function saveAdjustment(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'column' => 'required|string',
            'value' => 'required|numeric',
        ]);

        $date = $request->input('date');
        $column = $request->input('column');
        $value = $request->input('value');

        $allowedColumns = [
            "CTCunder",
            "CTCover",
            "RPTunder",
            "RPTover",
            "GFTFunder",
            "GFTFover",
        ];

        // ✅ Validate column name
        if (!in_array($column, $allowedColumns)) {
            return response()->json([
                'error' => "Invalid column name: $column",
            ], 400);
        }

        try {
            $affected = DB::table('full_report_rcd')
                ->where('date', $date)
                ->update([$column => $value]);

            if ($affected === 0) {
                return response()->json([
                    'error' => "No record found for the given date",
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => "Adjustment updated successfully!",
            ]);

        } catch (\Exception $e) {
            \Log::error("❌ Database update error: " . $e->getMessage());
            return response()->json([
                'error' => "Database update failed",
            ], 500);
        }
    }
}
