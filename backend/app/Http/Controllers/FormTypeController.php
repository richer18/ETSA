<?php

namespace App\Http\Controllers;

use App\Models\FormType;

class FormTypeController extends Controller
{
    public function index()
    {
        return FormType::all(); // return all form types as JSON
    }
}
