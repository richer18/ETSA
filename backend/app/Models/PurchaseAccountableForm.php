<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseAccountableForm extends Model
{
    use HasFactory;

    protected $table = 'purchase_accountable_forms';

    protected $fillable = [
        'purchase_date',
        'Form_Type',
        'Serial_No',
        'Receipt_Range_From',
        'Receipt_Range_To',
        'Stock',
        'Status',
    ];
}
