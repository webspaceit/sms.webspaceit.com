<?php

namespace App\Http\Controllers;

use App\Models\HeroSlider;
use App\Models\Notice;
use App\Models\SchoolSetting;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FrontController extends Controller
{
    public function home(): Response
    {
        $sliders = HeroSlider::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'subtitle' => $s->subtitle,
                'description' => $s->description,
                'image' => $s->image,
                'button_text' => $s->button_text,
                'button_url' => $s->button_url,
            ]);

        $settings = SchoolSetting::all()->pluck('value', 'key');

        $notices = Notice::where('is_published', true)
            ->orderBy('published_date', 'desc')
            ->limit(6)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'content' => $n->content,
                'published_date' => $n->published_date?->format('M d, Y'),
            ]);

        $stats = [
            ['label' => 'Students', 'value' => number_format(DB::table('students')->count())],
            ['label' => 'Teachers', 'value' => number_format(DB::table('teachers')->count())],
            ['label' => 'Classes', 'value' => number_format(DB::table('classes')->count())],
            ['label' => 'Years Established', 'value' => $settings->get('school_established', 'N/A')],
        ];

        return Inertia::render('welcome', [
            'sliders' => $sliders,
            'settings' => $settings,
            'notices' => $notices,
            'stats' => $stats,
        ]);
    }
}
