<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category_id', 'quantity', 'minimum_quantity', 'unit_price', 'description'];

    protected $casts = ['quantity' => 'integer', 'minimum_quantity' => 'integer', 'unit_price' => 'decimal:2'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(InventoryCategory::class, 'category_id');
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->minimum_quantity;
    }
}
