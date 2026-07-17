<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\SchoolSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolSettingController extends Controller
{
    public function index(): Response
    {
        $settings = SchoolSetting::all()->map(fn ($s) => ['key' => $s->key, 'value' => $s->value]);
        $academicYears = AcademicYear::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/school-settings/index', [
            'settings' => $settings,
            'academicYears' => $academicYears,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'nullable|string',
            'school_name_bn' => 'nullable|string',
            'school_address' => 'nullable|string',
            'school_address_bn' => 'nullable|string',
            'school_phone' => 'nullable|string',
            'school_email' => 'nullable|string',
            'school_established' => 'nullable|string',
            'school_eiin' => 'nullable|string',
            'school_footer' => 'nullable|string',
            'school_footer_url' => 'nullable|string',
            'academic_year_id' => 'nullable|string',
            'currency' => 'nullable|string|max:10',
            'admission_prefix' => 'nullable|string|max:20',
        ]);

        foreach ($validated as $key => $value) {
            SchoolSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Settings updated successfully.')]);

        return redirect()->back();
    }
}
