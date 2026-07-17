<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class BookIssue extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'issuable_type',
        'issuable_id',
        'issue_date',
        'due_date',
        'return_date',
        'fine',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date:Y-m-d',
            'due_date' => 'date:Y-m-d',
            'return_date' => 'date:Y-m-d',
            'fine' => 'decimal:2',
        ];
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function issuable(): MorphTo
    {
        return $this->morphTo();
    }
}
