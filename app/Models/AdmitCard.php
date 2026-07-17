<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmitCard extends Model
{
    protected $fillable = [
        'class_name',
        'section',
        'exam_name',
        'academic_year',
        'start_time',
        'instructions',
        'routine',
    ];

    protected $casts = [
        'instructions' => 'array',
        'routine' => 'array',
    ];
}
