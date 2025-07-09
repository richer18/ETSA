<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityTaxCertificateSaveCedulaDataController extends Controller
{
    public function store(Request $request)
    {
        // Extract request data
        $DATEISSUED = $request->input('DATEISSUED');
        $TRANSDATE = $request->input('TRANSDATE');
        $CTCNO = $request->input('CTCNO');
        $CTCTYPE = $request->input('CTCTYPE');
        $OWNERNAME = $request->input('OWNERNAME');
        $BASICTAXDUE = $request->input('BASICTAXDUE');
        $SALTAXDUE = $request->input('SALTAXDUE');
        $INTEREST = $request->input('INTEREST');
        $TOTALAMOUNTPAID = $request->input('TOTALAMOUNTPAID');
        $USERID = $request->input('USERID');
        $CTCYEAR = $request->input('CTCYEAR');

        // Check if CTCNO already exists
        $exists = DB::selectOne("SELECT 1 FROM CEDULA WHERE CTCNO = ? LIMIT 1", [$CTCNO]);

        if ($exists) {
            return response()->json([
                'error' => 'CTCNO already exists. Cannot save duplicate.'
            ], 400);
        }

        try {
            // Insert new record
            $sql = "
                INSERT INTO CEDULA (
                    DATEISSUED,
                    TRANSDATE,
                    CTCNO,
                    CTCTYPE,
                    OWNERNAME,
                    BASICTAXDUE,
                    SALTAXDUE,
                    INTEREST,
                    TOTALAMOUNTPAID,
                    USERID,
                    CTCYEAR
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ";

            DB::insert($sql, [
                $DATEISSUED,
                date('Y-m-d H:i:s', strtotime($TRANSDATE)), // ensure MySQL-compatible format
                $CTCNO,
                $CTCTYPE,
                $OWNERNAME,
                $BASICTAXDUE,
                $SALTAXDUE,
                $INTEREST,
                $TOTALAMOUNTPAID,
                $USERID,
                $CTCYEAR
            ]);

            $id = DB::getPdo()->lastInsertId();

            return response()->json([
                'message' => 'Data saved successfully',
                'id' => $id
            ]);
        } catch (\Exception $e) {
            \Log::error("Error saving data: " . $e->getMessage());
            return response()->json(['error' => 'Failed to save data'], 500);
        }
    }
}
