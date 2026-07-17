<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'name',
        'room_no',
        'class_teacher_id',
    ];

    protected $appends = ['class_name'];

    protected $casts = [
        'class_teacher_id' => 'integer',
    ];

    public function getClassNameAttribute(): ?string
    {
        return $this->schoolClass?->name;
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function classTeacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'class_teacher_id');
    }
}
