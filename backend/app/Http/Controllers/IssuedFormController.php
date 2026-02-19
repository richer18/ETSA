<?php

namespace App\Http\Controllers;

use App\Models\IssuedAccountableForm;
use Illuminate\Http\Request;

class IssuedFormController extends Controller
{
    public function index(Request $request)
    {
        $query = IssuedAccountableForm::query();

        if ($request->filled('month')) {
            $query->whereMonth('Date', (int) $request->month);
        }

        if ($request->filled('year')) {
            $query->whereYear('Date', (int) $request->year);
        }

        $issuedForms = $query
            ->orderByDesc('Date')
            ->orderByDesc('id')
            ->get();

        return response()->json($issuedForms);
    }
}
