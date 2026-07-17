<?php

namespace App\Http\Controllers;

use App\Models\SmsSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SmsSettingController extends Controller
{
    public function index(): Response
    {
        $settings = SmsSetting::orderBy('provider')->get();

        return Inertia::render('school/sms-settings/index', [
            'settings' => $settings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider' => 'required|string|max:255',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'sender_id' => 'nullable|string|max:255',
            'api_base_url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            SmsSetting::where('is_active', true)->update(['is_active' => false]);
        }

        SmsSetting::create($validated);

        return redirect()->route('sms-settings.index')
            ->with('success', 'SMS setting saved.');
    }

    public function update(Request $request, SmsSetting $smsSetting)
    {
        $validated = $request->validate([
            'provider' => 'required|string|max:255',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'sender_id' => 'nullable|string|max:255',
            'api_base_url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            SmsSetting::where('is_active', true)->where('id', '!=', $smsSetting->id)->update(['is_active' => false]);
        }

        $smsSetting->update($validated);

        return redirect()->route('sms-settings.index')
            ->with('success', 'SMS setting updated.');
    }

    public function destroy(SmsSetting $smsSetting)
    {
        $smsSetting->delete();
        return redirect()->route('sms-settings.index')
            ->with('success', 'SMS setting deleted.');
    }
}
