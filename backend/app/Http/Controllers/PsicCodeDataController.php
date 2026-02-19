<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PsicCodeDataController extends Controller
{
    public function getDataPsic()
    {
        $sections = DB::connection('psic')->table('Sections')->get();

        foreach ($sections as $section) {
            $section->Divisions = DB::connection('psic')
                ->table('Divisions')
                ->where('section_code', $section->section_code)
                ->get();

            foreach ($section->Divisions as $division) {
                $division->Groups = DB::connection('psic')
                    ->table('Groups')
                    ->where('division_code', $division->division_code)
                    ->get();

                foreach ($division->Groups as $group) {
                    $group->Classes = DB::connection('psic')
                        ->table('Classes')
                        ->where('group_code', $group->group_code)
                        ->get();

                    foreach ($group->Classes as $classData) {
                        $classData->Subclasses = DB::connection('psic')
                            ->table('Subclasses')
                            ->where('class_code', $classData->class_code)
                            ->get();
                    }
                }
            }
        }

        return response()->json($sections);
    }
}
