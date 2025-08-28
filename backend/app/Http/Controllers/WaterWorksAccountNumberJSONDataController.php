<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class WaterWorksAccountNumberJSONDataController extends Controller
{
    private $dataDir = "storage/waterworks"; // 👈 Adjust if needed

    public function show($accountNumber)
    {
        // File path: ZAM_<accountNumber>.json
        $filePath = $this->dataDir . "/ZAM_" . $accountNumber . ".json";

        if (!File::exists($filePath)) {
            return response()->json([
                "message" => "Account not found"
            ], 404);
        }

        $account = json_decode(File::get($filePath), true);

        return response()->json($account);
    }
}
