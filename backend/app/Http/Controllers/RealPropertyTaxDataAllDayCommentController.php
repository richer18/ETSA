<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class RealPropertyTaxDataAllDayCommentController extends Controller
{
    public function store(Request $request)
    {
        $description = $request->input('description');
        $user = $request->input('user');

        if (!$description || !$user) {
            return response()->json(['error' => 'Description and user are required'], 400);
        }

        try {
            $now = Carbon::now();
            $date = $now->format('Y-m-d');
            $time = $now->format('H:i:s');

            DB::table('rpt_comments')->insert([
                'date'        => $date,
                'description' => $description,
                'time'        => $time,
                'user'        => $user,
            ]);

            return response()->json(['message' => 'Comment saved successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error saving RPT comment: ' . $e->getMessage());
            return response()->json(['error' => 'Error saving comment'], 500);
        }
    }
}
