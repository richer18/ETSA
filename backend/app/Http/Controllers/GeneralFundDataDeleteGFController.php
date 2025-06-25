<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneralFundDataDeleteGFController extends Controller
{
    public function destroy($id)
    {
        try {
            $deleted = DB::table('general_fund_data')->where('id', $id)->delete();

            if ($deleted === 0) {
                return response()->json(['message' => 'Record not found'], 404);
            }

            return response()->json(['message' => 'Record deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting record: ' . $e->getMessage());
            return response()->json(['error' => 'Error deleting record'], 500);
        }
    }
}
