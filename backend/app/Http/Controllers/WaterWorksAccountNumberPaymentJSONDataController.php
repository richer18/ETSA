<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class WaterWorksAccountNumberPaymentJSONDataController extends Controller
{
    private $dataDir = "storage/waterworks"; // 👈 adjust as needed

    public function pay(Request $request, $accountNumber)
    {
        $filePath = $this->dataDir . "/ZAM_" . $accountNumber . ".json";

        // Check if account exists
        if (!File::exists($filePath)) {
            return response()->json([
                "message" => "Account not found"
            ], 404);
        }

        // Get request data
        $type = $request->input('type');     // "meter" or "monthly"
        $amount = (float) $request->input('amount');
        $month = $request->input('month');
        $usage = (float) $request->input('usage', 0);

        // Load account
        $account = json_decode(File::get($filePath), true);

        // Handle meter payment
        if ($type === "meter") {
            $currentBalance = $account['meterBalance'] ?? 0;
            $account['meterBalance'] = max(0, $currentBalance - $amount);
        }

        // Build payment record
        $payment = [
            "type" => $type,
            "amount" => $amount,
            "date" => now()->toISOString(),
        ];

        if ($type === "monthly") {
            $payment["month"] = $month;
            $payment["usage"] = $usage;
        }

        // Add to payments
        $account['payments'][] = $payment;

        // Save updated account
        File::put($filePath, json_encode($account, JSON_PRETTY_PRINT));

        return response()->json([
            "message" => "Payment recorded",
            "account" => $account
        ]);
    }
}
