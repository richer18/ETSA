<?php

namespace App\Support;

use Illuminate\Support\Facades\File;

class CollectorLogger
{
    public static function write(string $collector, string $event, array $context = []): void
    {
        try {
            $rootPath = dirname(base_path());
            $logDir = $rootPath . DIRECTORY_SEPARATOR . 'collector_logs';

            if (!File::exists($logDir)) {
                File::makeDirectory($logDir, 0755, true);
            }

            $safeCollector = preg_replace('/[^A-Za-z0-9_\- ]+/', '_', trim($collector));
            $safeCollector = $safeCollector !== '' ? $safeCollector : 'unknown_collector';
            $fileName = str_replace(' ', '_', $safeCollector) . '.log';
            $filePath = $logDir . DIRECTORY_SEPARATOR . $fileName;

            $line = [
                'timestamp' => now()->toDateTimeString(),
                'collector' => $collector,
                'event' => $event,
                'context' => $context,
            ];

            File::append($filePath, json_encode($line, JSON_UNESCAPED_UNICODE) . PHP_EOL);
        } catch (\Throwable $e) {
            // Do not break business flow when file logging fails.
        }
    }
}
