<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'publisher',
        'isbn',
        'edition',
        'quantity',
        'available',
        'shelf_location',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'available' => 'integer',
        ];
    }

    public function issues(): HasMany
    {
        return $this->hasMany(BookIssue::class, 'book_id');
    }
}
