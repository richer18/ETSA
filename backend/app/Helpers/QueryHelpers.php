<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Illuminate\Database\Query\Builder;

class QueryHelpers
{
    public static function addDateFilters(Builder $query, Request $request, $column = 'created_at')
    {
        if ($request->filled('month')) {
            $query->whereMonth($column, $request->month);
        }
        if ($request->filled('day')) {
            $query->whereDay($column, $request->day);
        }
        if ($request->filled('year')) {
            $query->whereYear($column, $request->year);
        }

        return $query;
    }
}
