<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RealPropertyTaxDataViewDialogUpdateCommentController extends Controller
{
    public function update(Request $request)
    {
        $receiptNo = $request->input('receipt_no');
        $comment = $request->input('comment');

        if (!$receiptNo || !$comment) {
            return response()->json(['error' => 'receipt_no and comment are required'], 400);
        }

        try {
            DB::table('real_property_tax_data')
                ->where('receipt_no', $receiptNo)
                ->update(['comments' => $comment]);

            Log::info("Comment updated for receipt_no: {$receiptNo}");

            return response()->json(['message' => 'Comment updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating comment: ' . $e->getMessage());
            return response()->json(['error' => 'Database update failed'], 500);
        }
    }
}
