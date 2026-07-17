<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'month',
        'year',
        'gross_salary',
        'deductions',
        'net_pay',
        'paid_date',
        'payment_method',
        'reference_no',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'gross_salary' => 'decimal:2',
            'deductions' => 'decimal:2',
            'net_pay' => 'decimal:2',
            'paid_date' => 'date:Y-m-d',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
