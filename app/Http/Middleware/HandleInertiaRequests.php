<?php

namespace App\Http\Middleware;

use App\Models\AcademicYear;
use App\Models\SchoolSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $academicYear = null;
        if ($request->user()) {
            $yearId = SchoolSetting::where('key', 'academic_year_id')->value('value');
            $academicYear = $yearId ? AcademicYear::find((int) $yearId)?->name : null;
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'academicYear' => $academicYear,
        ];
    }
}
