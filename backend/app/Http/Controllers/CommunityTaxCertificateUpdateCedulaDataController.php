<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityTaxCertificateUpdateCedulaDataController extends Controller
{
    public function update(Request $request, $oldCtcno)
    {
        $string255 = 'required|string|max:255';
        $nullableNumeric = 'nullable|numeric';
        $requiredDate = 'required|date';

        $validated = $request->validate([
            'DATEISSUED' => $requiredDate,
            'TRANSDATE' => $requiredDate,
            'CTCNO' => $string255,
            'CTCTYPE' => 'nullable|string|max:50',
            'OWNERNAME' => $string255,
            'BASICTAXDUE' => $nullableNumeric,
            'SALTAXDUE' => $nullableNumeric,
            'INTEREST' => $nullableNumeric,
            'TOTALAMOUNTPAID' => 'required|numeric',
            'USERID' => $string255,
            'CTCYEAR' => 'required|integer',
            'DATALASTEDITED' => $requiredDate,
        ]);

        $newCtcno = $validated['CTCNO'];

        if ($newCtcno !== $oldCtcno) {
            $duplicate = DB::table('cedula')->where('CTCNO', $newCtcno)->exists();
            if ($duplicate) {
                return response()->json([
                    'error' => 'Duplicate CTCNO exists. Update aborted.'
                ], 400);
            }
        }

        try {
            DB::table('cedula')
                ->where('CTCNO', $oldCtcno)
                ->update($validated);

            return response()->json(['message' => 'Data updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update data'], 500);
        }
    }
}
