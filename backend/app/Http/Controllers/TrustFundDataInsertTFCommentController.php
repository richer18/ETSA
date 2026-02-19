<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataInsertTFCommentController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'date'          => 'required|date',
            'receipt_no'    => 'required|string|max:255',
            'date_comment'  => 'required|date_format:Y-m-d H:i:s',
            'name_client'   => 'required|string|max:255',
            'description'   => 'required|string',
            'user'          => 'required|string|max:100',
        ]);

        try {
            DB::table('tf_comment')->insert([
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
            Log::error('Error inserting TF comment: ' . $e->getMessage());

            return response()->json([
                'error' => 'Database insertion failed',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
