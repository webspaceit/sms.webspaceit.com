<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exam_name',
        'academic_year',
        'class_position',
        'working_days',
        'present_days',
        'absent_days',
        'moral_evaluation',
        'co_curricular',
        'comments',
    ];

    protected $casts = [
        'co_curricular' => 'array',
        'class_position' => 'integer',
        'working_days' => 'integer',
        'present_days' => 'integer',
        'absent_days' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function marks(): HasMany
    {
        return $this->hasMany(AcademicReportMark::class);
    }
}
