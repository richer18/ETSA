<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataViewDialogInsertCommentController extends Controller
{
    private const REQUIRED_STRING = 'required|string';

    public function insert(Request $request)
    {
        $validated = $request->validate([
            'date'         => 'required|date',
            'receipt_no'   => self::REQUIRED_STRING,
            'date_comment' => 'required|date_format:Y-m-d H:i:s',
            'name_client'  => self::REQUIRED_STRING,
            'description'  => self::REQUIRED_STRING,
            'user'         => self::REQUIRED_STRING,
        ]);

        try {
            DB::table('rpt_comment')->insert([
                'date'         => $validated['date'],
                'receipt_no'   => $validated['receipt_no'],
                'date_comment' => $validated['date_comment'],
                'name_client'  => $validated['name_client'],
                'description'  => $validated['description'],
                'user'         => $validated['user'],
                'created_at'   => now(),
            ]);

            return response()->json(['message' => 'Comment inserted successfully'], 200);

        } catch (\Exception $e) {
            Log::error('Insert comment failed: ' . $e->getMessage());
            return response()->json(['error' => 'Database insert failed'], 500);
        }
    }
}
