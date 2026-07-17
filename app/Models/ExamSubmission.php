<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamSubmission extends Model
{
    use HasFactory;

    protected $fillable = ['online_exam_id', 'student_id', 'answers', 'score', 'total_marks', 'submitted_at'];

    protected $casts = [
        'answers' => 'array',
        'submitted_at' => 'datetime',
    ];

    public function onlineExam(): BelongsTo
    {
        return $this->belongsTo(OnlineExam::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
