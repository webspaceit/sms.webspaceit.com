<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeCarryForward extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'academic_year_id', 'amount', 'reason', 'date'];

    protected $casts = ['date' => 'date:Y-m-d', 'amount' => 'decimal:2'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
