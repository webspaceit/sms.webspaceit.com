<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CommunicationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel',
        'recipient',
        'subject',
        'message',
        'status',
        'response',
        'sendable_type',
        'sendable_id',
    ];

    public function sendable(): MorphTo
    {
        return $this->morphTo();
    }
}
