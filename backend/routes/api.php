<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Cedula;
use App\Models\GeneralFundData;
use App\Models\TrustFundData;
use App\Models\RealPropertyTaxData;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\RealPropertyTaxController;
use App\Http\Controllers\RealPropertyTaxControllerTotalFund;
use App\Http\Controllers\RealPropertyTaxControllerTotalGeneralFund;
use App\Http\Controllers\RealPropertyTaxControllerTotalSEFFund;
use App\Http\Controllers\RealPropertyTaxControllerTotalShareFund;
use App\Http\Controllers\RealPropertyTaxSaveDataController;
use App\Http\Controllers\RealPropertyTaxUpdateDataController;
use App\Http\Controllers\RealPropertyTaxDeleteDataController;
use App\Http\Controllers\RealPropertyTaxDataCommentRPTCountsController;
use App\Http\Controllers\RealPropertyTaxDataAllDayCommentController;
use App\Http\Controllers\RealPropertyTaxDataGetRPTCommentsController;
use App\Http\Controllers\RealPropertyTaxDataLandSharingDataController;
use App\Http\Controllers\RealPropertyTaxDataSefLandSharingDataController;
use App\Http\Controllers\RealPropertyTaxDataBuildingSharingDataController;
use App\Http\Controllers\RealPropertyTaxDataSefBuildingSharingDataController;
use App\Http\Controllers\RealPropertyTaxDataLandDataController;
use App\Http\Controllers\RealPropertyTaxDataBldgDataController;
use App\Http\Controllers\RealPropertyTaxDataSefLandDataController;
use App\Http\Controllers\RealPropertyTaxDataSefBldgDataController;
use App\Http\Controllers\RealPropertyTaxDataGrandTotalSharingController;
use App\Http\Controllers\RealPropertyTaxDataSefGrandTotalSharingController;
use App\Http\Controllers\RealPropertyTaxDataOverAllTotalBasicAndSEFController;
use App\Http\Controllers\RealPropertyTaxDataOverAllTotalBasicAndSEFSharingController;
use App\Http\Controllers\RealPropertyTaxDataViewDialogUpdateCommentController;
use App\Http\Controllers\RealPropertyTaxDataViewDialogInsertCommentController;


use App\Http\Controllers\GeneralFundDataAllController;
use App\Http\Controllers\GeneralFundDataTotalFundsController;
use App\Http\Controllers\GeneralFundDataTaxOnBusinessTotalController;
use App\Http\Controllers\GeneralFundDataRegulatoryFeesTotalController;
use App\Http\Controllers\GeneralFundDataServiceUserChargesTotalController;
use App\Http\Controllers\GeneralFundDataReceiptsFromEconomicEnterprisesTotalController;
use App\Http\Controllers\GeneralFundDataUpdateGeneralFundDataController;
use App\Http\Controllers\GeneralFundDataSaveGeneralFundDataController;
use App\Http\Controllers\GeneralFundDataDeleteGFController;
use App\Http\Controllers\GeneralFundDataAllDataGeneralFundController;
use App\Http\Controllers\GeneralFundDataViewalldataGeneralFundTableViewController;
use App\Http\Controllers\GeneralFundDataGetGFCommentsController;
use App\Http\Controllers\GeneralFundDataCommentGFCountsController;
use App\Http\Controllers\GeneralFundDataGenerateReportController;
use App\Http\Controllers\GeneralFundDataGeneralFundDataReportController;
use App\Http\Controllers\GeneralFundTotalTaxReportController;
use App\Http\Controllers\GeneralFundDataTaxOnBusinessReportController;
use App\Http\Controllers\GeneralFundDataServiceUserChargesController;
use App\Http\Controllers\GeneralFundDataRegulatoryFeesController;
use App\Http\Controllers\GeneralFundDataReceiptsFromEconomicEnterpriseController;

use App\Http\Controllers\TrustFundDataAllDataController;
use App\Http\Controllers\TrustFundDataTotalAllDataController;
use App\Http\Controllers\TrustFundDataBuildingPermitFeeTotalController;
use App\Http\Controllers\TrustFundDataElectricalFeeTotalController;
use App\Http\Controllers\TrustFundDataZoningFeeTotalController;
use App\Http\Controllers\TrustFundDataLivestockDevFundTotalController;
use App\Http\Controllers\TrustFundDataDivingFeeTotalController;
use App\Http\Controllers\TrustFundDataAllDataTrustFundController;
use App\Http\Controllers\TrustFundDataViewAllDataTrustFundTableViewController;
use App\Http\Controllers\TrustFundDataGetTFCommentsController;
use App\Http\Controllers\TrustFundDataCommentTFCountsController;
use App\Http\Controllers\TrustFundDataUpdateTFCommentController;
use App\Http\Controllers\TrustFundDataInsertTFCommentController;
use App\Http\Controllers\TrustFundDataBuildingPermitFeesController;
use App\Http\Controllers\TrustFundDataTotalFeesReportsController;
use App\Http\Controllers\TrustFundDataElectricalPermitFeesController;
use App\Http\Controllers\TrustFundDataZoningPermitFeesController;
use App\Http\Controllers\TrustFundDataLivestockDevFundFeesController;
use App\Http\Controllers\TrustFundDataDivingFeesController;
use App\Http\Controllers\TrustFundDataSaveDataController;
use App\Http\Controllers\TrustFundDataUpdateDataController;
use App\Http\Controllers\TrustFundDataReportDataController;

use App\Http\Controllers\CommunityTaxCertificateCedulaDataController;
use App\Http\Controllers\CommunityTaxCertificateCedulaDailyCollectionController;
use App\Http\Controllers\CommunityTaxCertificateViewDailyCollectionDetailsCedulaController;
use App\Http\Controllers\CommunityTaxCertificateGetCedulaCommentsController;
use App\Http\Controllers\CommunityTaxCertificateCommentCedulaCountsController;
use App\Http\Controllers\CommunityTaxCertificateSummaryCollectionDataReportController;
use App\Http\Controllers\CommunityTaxCertificateSaveCedulaDataController;
use App\Http\Controllers\CommunityTaxCertificateUpdateCedulaDataController;

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

Route::get('/rpt-json', function () {
    $path = storage_path('app/public/rpt_data.json');

    if (!file_exists($path)) {
        return response()->json(['error' => 'Data not exported yet'], 404);
    }

    $data = json_decode(file_get_contents($path), true);
    return response()->json($data);
});


Route::get('/allData', [RealPropertyTaxController::class, 'allData']);
Route::get('/TotalFund', [RealPropertyTaxControllerTotalFund::class, 'index']);
Route::get('/TotalGeneralFund', [RealPropertyTaxControllerTotalGeneralFund::class, 'index']);
Route::get('/TotalSEFFund', [RealPropertyTaxControllerTotalSEFFund::class, 'index']);
Route::get('/TotalShareFund', [RealPropertyTaxControllerTotalShareFund::class, 'index']);
Route::post('/saverptdata', [RealPropertyTaxSaveDataController::class, 'store']);
Route::put('/updaterptdata/{id}', [RealPropertyTaxUpdateDataController::class, 'update']);
Route::delete('/deleteRPT/{id}', [RealPropertyTaxDeleteDataController::class, 'destroy']);
Route::get('/commentRPTCounts', [RealPropertyTaxDataCommentRPTCountsController::class, 'index']);
Route::post('/allDayComment', [RealPropertyTaxDataAllDayCommentController::class, 'store']);
Route::get('/LandSharingData', [RealPropertyTaxDataLandSharingDataController::class, 'index']);
Route::get('/sefLandSharingData', [RealPropertyTaxDataSefLandSharingDataController::class, 'index']);
Route::get('/buildingSharingData', [RealPropertyTaxDataBuildingSharingDataController::class, 'index']);
Route::get('/sefBuildingSharingData', [RealPropertyTaxDataSefBuildingSharingDataController::class, 'index']);
Route::get('/landData', [RealPropertyTaxDataLandDataController::class, 'index']);
Route::get('/bldgData', [RealPropertyTaxDataBldgDataController::class, 'index']);
Route::get('/seflandData', [RealPropertyTaxDataSefLandDataController::class, 'index']);
Route::get('/sefbldgData', [RealPropertyTaxDataSefBldgDataController::class, 'index']);
Route::get('/grandTotalSharing', [RealPropertyTaxDataGrandTotalSharingController::class, 'index']);
Route::get('/sefGrandTotalSharing', [RealPropertyTaxDataSefGrandTotalSharingController::class, 'index']);
Route::get('/overallTotalBasicAndSEF', [RealPropertyTaxDataOverAllTotalBasicAndSEFController::class, 'index']);
Route::get('/overallTotalBasicAndSEFSharing', [RealPropertyTaxDataOverAllTotalBasicAndSEFSharingController::class, 'index']);
Route::post('/updateComment', [RealPropertyTaxDataViewDialogUpdateCommentController::class, 'update']);
Route::post('/insertComment', [RealPropertyTaxDataViewDialogInsertCommentController::class, 'insert']);

Route::get('/generalFundDataAll', [GeneralFundDataAllController::class, 'index']);
Route::get('/TotalGeneralFunds', [GeneralFundDataTotalFundsController::class, 'index']);
Route::get('/TaxOnBusinessTotal', [GeneralFundDataTaxOnBusinessTotalController::class, 'index']);
Route::get('/RegulatoryFeesTotal', [GeneralFundDataRegulatoryFeesTotalController::class, 'index']);
Route::get('/ServiceUserChargesTotal', [GeneralFundDataServiceUserChargesTotalController::class, 'index']);
Route::get('/ReceiptsFromEconomicEnterprisesTotal', [GeneralFundDataReceiptsFromEconomicEnterprisesTotalController::class, 'index']);
Route::put('/updateGeneralFundData/{id}', [GeneralFundDataUpdateGeneralFundDataController::class, 'update']);
Route::post('/saveGeneralFundData', [GeneralFundDataSaveGeneralFundDataController::class, 'store']);
Route::delete('/deleteGF/{id}', [GeneralFundDataDeleteGFController::class, 'destroy']);
Route::get('/allDataGeneralFund', [GeneralFundDataAllDataGeneralFundController::class, 'index']);
Route::get('/viewalldataGeneralFundTableView', [GeneralFundDataViewalldataGeneralFundTableViewController::class, 'index']);
Route::get('/getGFComments/{date}', [GeneralFundDataGetGFCommentsController::class, 'show']);
Route::get('/commentGFCounts', [GeneralFundDataCommentGFCountsController::class, 'index']);
Route::post('/generate-report', [GeneralFundDataGenerateReportController::class, 'generate']);
Route::get('/generalFundDataReport', [GeneralFundDataGeneralFundDataReportController::class, 'index']);
Route::get('/getRPTComments/{date}', [RealPropertyTaxDataGetRPTCommentsController::class, 'show']);
Route::get('/general-fund-total-tax-report', [GeneralFundTotalTaxReportController::class, 'index']);
Route::get('/general-fund-tax-on-business-report', [GeneralFundDataTaxOnBusinessReportController::class, 'index']);
Route::get('/general-fund-service-user-charges', [GeneralFundDataServiceUserChargesController::class, 'index']);
Route::get('/general-fund-regulatory-fees-report', [GeneralFundDataRegulatoryFeesController::class, 'index']);
Route::get('/general-fund-receipts-from-economic-enterprise-report', [GeneralFundDataReceiptsFromEconomicEnterpriseController::class, 'index']);

Route::get('/table-trust-fund-all', [TrustFundDataAllDataController::class, 'index']);
Route::get('/trust-fund-total', [TrustFundDataTotalAllDataController::class, 'index']);
Route::get('/BuildingPermitFeeTotal', [TrustFundDataBuildingPermitFeeTotalController::class, 'index']);
Route::get('/ElectricalFeeTotal', [TrustFundDataElectricalFeeTotalController::class, 'index']);
Route::get('/ZoningFeeTotal', [TrustFundDataZoningFeeTotalController::class, 'index']);
Route::get('/LivestockDevFundTotal', [TrustFundDataLivestockDevFundTotalController::class, 'index']);
Route::get('/DivingFeeTotal', [TrustFundDataDivingFeeTotalController::class, 'index']);

Route::get('/allDataTrustFund', [TrustFundDataAllDataTrustFundController::class, 'index']);
Route::get('/viewalldataTrustFundTableView', [TrustFundDataViewAllDataTrustFundTableViewController::class, 'index']);
Route::get('/getTFComments/{date}', [TrustFundDataGetTFCommentsController::class, 'show']);
Route::get('/commentTFCounts', [TrustFundDataCommentTFCountsController::class, 'index']);
Route::post('/updateTFComment', TrustFundDataUpdateTFCommentController::class);
Route::post('/insertTFComment', TrustFundDataInsertTFCommentController::class);
Route::get('/trust-fund-building-permit-fees', [TrustFundDataBuildingPermitFeesController::class, 'index']);
Route::get('/trust-fund-total-fees-reports', TrustFundDataTotalFeesReportsController::class);
Route::get('/trust-fund-electrical-permit-fees', TrustFundDataElectricalPermitFeesController::class);
Route::get('/trust-fund-zoning-permit-fees', TrustFundDataZoningPermitFeesController::class);
Route::get('/trust-fund-livestock-dev-fund-fees', TrustFundDataLivestockDevFundFeesController::class);
Route::get('/trust-fund-diving-fees', TrustFundDataDivingFeesController::class);
Route::post('/save-trust-fund', [TrustFundDataSaveDataController::class, 'store']);
Route::put('/update-trust-fund/{id}', [TrustFundDataUpdateDataController::class, 'update']);
Route::get('/trustFundDataReport', [TrustFundDataReportDataController::class, 'index']);

Route::get('/cedula', [CommunityTaxCertificateCedulaDataController::class, 'index']);
Route::get('/CedulaDailyCollection', [CommunityTaxCertificateCedulaDailyCollectionController::class, 'index']);
Route::get('/viewDailyCollectionDetailsCedula', [CommunityTaxCertificateViewDailyCollectionDetailsCedulaController::class, 'index']);
Route::get('/getCedulaComments/{date}', [CommunityTaxCertificateGetCedulaCommentsController::class, 'show']);
Route::get('/commentCedulaCounts', [CommunityTaxCertificateCommentCedulaCountsController::class, 'index']);
Route::get('/cedulaSummaryCollectionDataReport', [CommunityTaxCertificateSummaryCollectionDataReportController::class, 'index']);
Route::post('/saveCedulaData', [CommunityTaxCertificateSaveCedulaDataController::class, 'store']);
Route::put('/updateCedulaData/{ctcno}', [CommunityTaxCertificateUpdateCedulaDataController::class, 'update']);
