<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityTaxCertificateGetCedulaCommentsController extends Controller
{
    public function show($date)
    {
        try {
            $results = DB::select("
                SELECT id,
                       DATE_FORMAT(date, '%Y-%m-%d') AS date,
                       receipt_no,
                       DATE_FORMAT(date_comment, '%Y-%m-%d %H:%i:%s') AS date_comment,
                       name_client,
                       description,
                       user,
                       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
                FROM cedula_comment
                WHERE date = ?
                ORDER BY created_at DESC
            ", [$date]);

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error("Error fetching comments: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching comments'], 500);
        }
    }
}
