<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HostelRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_no',
        'type',
        'capacity',
        'rent_per_bed',
        'facilities',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'rent_per_bed' => 'decimal:2',
        ];
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(HostelAllocation::class, 'hostel_room_id');
    }
}
