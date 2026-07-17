<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeritList extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_name',
        'section',
        'exam_name',
        'academic_year',
    ];
}
