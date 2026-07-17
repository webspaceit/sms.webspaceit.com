<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notice extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'type',
        'target_roles',
        'published_date',
        'expires_date',
        'is_published',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'published_date' => 'date:Y-m-d',
            'expires_date' => 'date:Y-m-d',
            'is_published' => 'boolean',
            'target_roles' => 'array',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
