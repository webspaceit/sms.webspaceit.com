<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'basic_salary',
        'house_rent',
        'medical',
        'transport_allowance',
        'other_allowances',
        'deductions',
        'notes',
        'effective_from',
    ];

    protected function casts(): array
    {
        return [
            'basic_salary' => 'decimal:2',
            'house_rent' => 'decimal:2',
            'medical' => 'decimal:2',
            'transport_allowance' => 'decimal:2',
            'other_allowances' => 'decimal:2',
            'deductions' => 'decimal:2',
            'effective_from' => 'date:Y-m-d',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
