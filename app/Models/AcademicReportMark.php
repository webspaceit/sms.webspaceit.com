<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicReportMark extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_report_id',
        'subject_name',
        'full_marks',
        'highest_marks',
        'written_marks',
        'mcq_marks',
        'practical_marks',
        'ca_marks',
    ];

    protected $casts = [
        'full_marks' => 'integer',
        'highest_marks' => 'integer',
        'written_marks' => 'integer',
        'mcq_marks' => 'integer',
        'practical_marks' => 'integer',
        'ca_marks' => 'integer',
    ];

    protected $appends = ['total_marks', 'grade_point', 'letter_grade'];

    public function report(): BelongsTo
    {
        return $this->belongsTo(AcademicReport::class, 'academic_report_id');
    }

    public function getTotalMarksAttribute(): int
    {
        return ($this->written_marks ?? 0) +
               ($this->mcq_marks ?? 0) +
               ($this->practical_marks ?? 0) +
               ($this->ca_marks ?? 0);
    }

    public function getGradePointAttribute(): float
    {
        $total = $this->total_marks;
        if ($total >= 80) return 5.0;
        if ($total >= 70) return 4.0;
        if ($total >= 60) return 3.5;
        if ($total >= 50) return 3.0;
        if ($total >= 40) return 2.0;
        if ($total >= 33) return 1.0;
        return 0.0;
    }

    public function getLetterGradeAttribute(): string
    {
        $total = $this->total_marks;
        if ($total >= 80) return 'A+';
        if ($total >= 70) return 'A';
        if ($total >= 60) return 'A-';
        if ($total >= 50) return 'B';
        if ($total >= 40) return 'C';
        if ($total >= 33) return 'D';
        return 'F';
    }
}
