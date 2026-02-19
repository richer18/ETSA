<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FetchReportDataController extends Controller
{
    public function fetchReport()
    {
        try {
            $sql = "
                SELECT
                  DATE_FORMAT(date, '%Y-%m-%d') AS date,
                  COALESCE(GF, 0) AS GF,
                  COALESCE(TF, 0) AS TF,
                  COALESCE(dueFrom, 0) AS dueFrom,
                  COALESCE(comment, '') AS comment,

                  -- Adjustment Values
                  COALESCE(CTCunder, 0) AS CTCunder,
                  COALESCE(CTCover, 0) AS CTCover,
                  COALESCE(RPTunder, 0) AS RPTunder,
                  COALESCE(RPTover, 0) AS RPTover,
                  COALESCE(GFTFunder, 0) AS GFTFunder,
                  COALESCE(GFTFover, 0) AS GFTFover,

                  -- Raw Values
                  COALESCE(ctc, 0) AS raw_ctc,
                  COALESCE(rpt, 0) AS raw_rpt,
                  COALESCE(gfAndTf, 0) AS raw_gfAndTf
                FROM full_report_rcd
                ORDER BY date
            ";

            $results = DB::select($sql);

            $formattedResults = collect($results)->map(function ($row) {
                $row = (array) $row; // Convert stdClass to array

                $ctc = ($row['raw_ctc'] ?? 0) + ($row['CTCunder'] ?? 0) - ($row['CTCover'] ?? 0);
                $rpt = ($row['raw_rpt'] ?? 0) + ($row['RPTunder'] ?? 0) - ($row['RPTover'] ?? 0);
                $gfAndTf = ($row['raw_gfAndTf'] ?? 0) + ($row['GFTFunder'] ?? 0) - ($row['GFTFover'] ?? 0);
                $dueFrom = $row['dueFrom'] ?? 0;

                $rcdTotal = $ctc + $rpt + $gfAndTf + $dueFrom;

                return [
                    'date' => $row['date'],
                    'GF' => $row['GF'],
                    'TF' => $row['TF'],
                    'dueFrom' => $dueFrom,
                    'comment' => $row['comment'],
                    'ctc' => $ctc,
                    'rpt' => $rpt,
                    'gfAndTf' => $gfAndTf,
                    'rcdTotal' => $rcdTotal,
                    'adjustments' => [
                        'ctc' => ['under' => $row['CTCunder'], 'over' => $row['CTCover']],
                        'rpt' => ['under' => $row['RPTunder'], 'over' => $row['RPTover']],
                        'gfAndTf' => ['under' => $row['GFTFunder'], 'over' => $row['GFTFover']],
                    ],
                ];
            });

            return response()->json($formattedResults);

        } catch (\Exception $e) {
            \Log::error("❌ Error fetching report: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching data'], 500);
        }
    }
}
