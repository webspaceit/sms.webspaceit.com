<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id', 'subject_id', 'teacher_id', 'topic',
        'topic_overview', 'lesson_breakdown', 'lesson_date',
    ];

    protected $casts = ['lesson_date' => 'date:Y-m-d'];

    public function class(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
