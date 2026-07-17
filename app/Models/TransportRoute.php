<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'driver_name',
        'driver_phone',
        'vehicle_no',
        'fare',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'fare' => 'decimal:2',
        ];
    }

    public function stops(): HasMany
    {
        return $this->hasMany(TransportStop::class, 'transport_route_id');
    }
}
