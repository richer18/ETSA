<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IssuedAccountableForm extends Model
{
    use HasFactory;

    protected $table = 'issued_accountable_forms';
    protected $primaryKey = 'ID';

    protected $guarded = [];

    public $timestamps = false;
}
