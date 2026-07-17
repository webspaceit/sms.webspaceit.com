<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeCollection extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'fee_head_id',
        'academic_year_id',
        'invoice_no',
        'month',
        'amount',
        'status',
        'due_date',
        'paid_on',
        'payment_method',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date:Y-m-d',
            'paid_on' => 'date:Y-m-d',
            'amount' => 'decimal:2',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function feeHead(): BelongsTo
    {
        return $this->belongsTo(FeeHead::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
