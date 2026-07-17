<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'provider_key', 'api_key', 'api_secret', 'merchant_id', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
