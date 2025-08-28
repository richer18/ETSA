<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class WaterWorksRegisterJSONDataController extends Controller
{
    private $dataDir;

    public function __construct()
    {
        // Absolute storage path
        $this->dataDir = storage_path("waterworks");
    }

    public function register(Request $request)
    {
        $data = $request->all();

        // ✅ Ensure directory exists
        if (!File::exists($this->dataDir)) {
            File::makeDirectory($this->dataDir, 0777, true, true);
        }

        // ✅ Build file name: ZAM_<accountNumber>.json
        $fileName = "ZAM_" . $data['accountNumber'] . ".json";
        $filePath = $this->dataDir . DIRECTORY_SEPARATOR . $fileName;

        // ✅ Prepare entry
        $entry = array_merge(
            [
                "date" => now()->toISOString(),
                "meterBalance" => isset($data['meterBalance']) ? (float) $data['meterBalance'] : 0,
                "payments" => [],
            ],
            $data
        );

        // ✅ Check for duplicate waterMeter number
        $files = File::files($this->dataDir);
        foreach ($files as $file) {
            if ($file->getExtension() === "json") {
                $content = json_decode(File::get($file->getPathname()), true);
                if (isset($content['waterMeter']) && $content['waterMeter'] === $data['waterMeter']) {
                    return response()->json([
                        "message" => "Water Meter Number already used!"
                    ], 400);
                }
            }
        }

        // ✅ Debug log
        \Log::info("Saving JSON file", [
            "filePath" => $filePath,
            "data" => $entry
        ]);

        // ✅ Save JSON file
        File::put($filePath, json_encode($entry, JSON_PRETTY_PRINT));

        // ✅ Confirm file exists and return saved content
        if (File::exists($filePath)) {
            return response()->json([
                "message" => "Registration saved as {$fileName}",
                "saved_to" => $filePath,
                "content" => json_decode(File::get($filePath), true) // return actual saved data
            ]);
        }

        return response()->json([
            "message" => "Failed to save file!",
            "filePath" => $filePath
        ], 500);
    }
}
