<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSubject extends Model
{
    use HasFactory;

    protected $table = 'class_subject';

    protected $fillable = [
        'class_id',
        'subject_id',
        'full_marks',
        'written_marks',
        'mcq_marks',
        'practical_marks',
        'ca_marks',
        'pass_marks',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'full_marks' => 'decimal:2',
            'written_marks' => 'decimal:2',
            'mcq_marks' => 'decimal:2',
            'practical_marks' => 'decimal:2',
            'ca_marks' => 'decimal:2',
            'pass_marks' => 'decimal:2',
            'sort_order' => 'integer',
        ];
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
