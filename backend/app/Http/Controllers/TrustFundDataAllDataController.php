<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrustFundData;
use Illuminate\Support\Facades\Log;

class TrustFundDataAllDataController extends Controller
{
    public function index()
    {
        try {
            $data = TrustFundData::orderBy('DATE', 'desc')->get();
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching trust fund data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve data'], 500);
        }
    }
}
