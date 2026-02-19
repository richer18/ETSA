<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrustFundDataGetTFCommentsController extends Controller
{
    public function show($date)
    {
        try {
            $comments = DB::table('tf_comment')
                ->select(
                    'id',
                    DB::raw("DATE_FORMAT(date, '%Y-%m-%d') as date"),
                    'receipt_no',
                    DB::raw("DATE_FORMAT(date_comment, '%Y-%m-%d %H:%i:%s') as date_comment"),
                    'name_client',
                    'description',
                    'user',
                    DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at")
                )
                ->whereDate('date', $date)
                ->orderByDesc('created_at')
                ->get();

            return response()->json($comments);

        } catch (\Exception $e) {
            Log::error('Error fetching TF comments: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching comments'], 500);
        }
    }
}
