<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['online_exam_id', 'question', 'type', 'options', 'correct_answer', 'marks'];

    protected $casts = ['options' => 'array'];

    public function onlineExam(): BelongsTo
    {
        return $this->belongsTo(OnlineExam::class);
    }
}
