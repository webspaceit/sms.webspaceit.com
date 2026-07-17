<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeHead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_bn',
        'frequency',
        'is_optional',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_optional' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function feeStructures(): HasMany
    {
        return $this->hasMany(FeeStructure::class);
    }
}
