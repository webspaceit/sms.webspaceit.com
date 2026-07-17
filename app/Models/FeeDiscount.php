<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeDiscount extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'fee_head_id', 'amount', 'reason', 'approved_by', 'date'];

    protected $casts = ['date' => 'date:Y-m-d', 'amount' => 'decimal:2'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function feeHead(): BelongsTo
    {
        return $this->belongsTo(FeeHead::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
