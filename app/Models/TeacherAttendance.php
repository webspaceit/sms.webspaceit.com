<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherAttendance extends Model
{
    use HasFactory;

    protected $table = 'teacher_attendances';

    protected $fillable = [
        'teacher_id',
        'date:Y-m-d',
        'status',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date:Y-m-d' => 'date:Y-m-d',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
