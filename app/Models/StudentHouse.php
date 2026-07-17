<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentHouse extends Model
{
    protected $fillable = [
        'name',
        'name_bn',
        'color',
        'description',
    ];
}
