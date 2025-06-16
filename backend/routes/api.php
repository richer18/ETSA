<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Cedula;
use App\Models\GeneralFundData;
use App\Models\TrustFundData;
use App\Models\RealPropertyTaxData;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'ping from Laravel']);
});

Route::get('/cedula', function () {
    return Cedula::all();
});

Route::get('/general_fund_data', function () {
    return GeneralFundData::all();
});

Route::get('/trust_fund_data', function () {
    return TrustFundData::all();
});

Route::get('/real_property_tax_data', function () {
    return RealPropertyTaxData::all();
});

Route::post('/login', function (Request $request) {
    $user = DB::table('users')->where('USERNAME', $request->username)->first();

    if (!$user || !Hash::check($request->password, $user->PASSWORD_HASH)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => [
            'id' => $user->USER_ID,
            'username' => $user->USERNAME,
            'role' => $user->ROLE,
            'status' => $user->ACCOUNT_STATUS,
        ]
    ]);
});

