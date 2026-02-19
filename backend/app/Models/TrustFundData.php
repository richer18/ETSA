<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrustFundData extends Model
{
    protected $table = 'trust_fund_data';   // name of your table

    protected $fillable = [
        'DATE',
        'RECEIPT_NO',
        'NAME',
        'BUILDING_PERMIT_FEE',
        'LOCAL_80_PERCENT',
        'TRUST_FUND_15_PERCENT',
        'NATIONAL_5_PERCENT',
        'ELECTRICAL_FEE',
        'ZONING_FEE',
        'LIVESTOCK_DEV_FUND',
        'LOCAL_80_PERCENT_LIVESTOCK',
        'NATIONAL_20_PERCENT',
        'DIVING_FEE',
        'LOCAL_40_PERCENT_DIVE_FEE',
        'FISHERS_30_PERCENT',
        'BRGY_30_PERCENT',
        'TOTAL',
        'CASHIER',
        'TYPE_OF_RECEIPT',
        'COMMENTS',
    ];
    public $timestamps = false;    // set to true if your table has created_at/updated_at
}
