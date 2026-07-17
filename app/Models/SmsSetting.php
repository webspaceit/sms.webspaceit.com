<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsSetting extends Model
{
    use HasFactory;

    protected $fillable = ['provider', 'api_key', 'api_secret', 'sender_id', 'api_base_url', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
