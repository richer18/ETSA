<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RcdEntry extends Model
{
    use HasFactory;

    protected $table = 'rcd_issued_form';

    protected $fillable = [
        'issued_date',
        'collector',
        'type_of_receipt',
        'receipt_no_from',
        'receipt_no_to',
        'total',
        'status',
    ];
}
