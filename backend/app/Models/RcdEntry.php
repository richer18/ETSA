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
        'fund',
        'collector',
        'type_of_receipt',
        'serial_no',
        'receipt_no_from',
        'receipt_no_to',
        'total',
        'status',
    ];
}
