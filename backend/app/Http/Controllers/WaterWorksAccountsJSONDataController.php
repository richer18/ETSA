<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class WaterWorksAccountsJSONDataController extends Controller
{
    private $dataDir = "storage/waterworks"; // 👈 Adjust to match your folder

    public function index()
    {
        $accounts = [];

        // Make sure directory exists
        if (!File::exists($this->dataDir)) {
            File::makeDirectory($this->dataDir, 0755, true);
        }

        // Get all files like ZAM_*.json
        $files = File::files($this->dataDir);

        foreach ($files as $file) {
            $fileName = $file->getFilename();
            if (str_starts_with($fileName, "ZAM_") && $file->getExtension() === "json") {
                $content = json_decode(File::get($file->getPathname()), true);

                if ($content) {
                    $accounts[] = [
                        "accountNumber" => $content['accountNumber'] ?? null,
                        "fullName" => trim(
                            ($content['lastName'] ?? '') . ", " .
                            ($content['firstName'] ?? '') . " " .
                            ($content['middleName'] ?? '')
                        ),
                    ];
                }
            }
        }

        return response()->json($accounts);
    }
}
