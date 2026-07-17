<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankReconciliation extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_name', 'account_number', 'statement_date',
        'ending_balance', 'cleared_balance', 'difference', 'status', 'notes',
    ];

    protected $casts = [
        'statement_date' => 'date:Y-m-d',
        'ending_balance' => 'decimal:2',
        'cleared_balance' => 'decimal:2',
        'difference' => 'decimal:2',
    ];
}
