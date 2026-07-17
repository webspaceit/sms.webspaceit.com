<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    use HasFactory;

    public function newQuery($excludeDeleted = true): Builder
    {
        $query = parent::newQuery($excludeDeleted);
        return $query->orderByRaw('CAST(SUBSTRING(name, 7) AS UNSIGNED)');
    }

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'shift',
    ];

    protected $casts = [
        'shift' => 'string',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class, 'class_id');
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(ClassSubject::class, 'class_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function feeStructures(): HasMany
    {
        return $this->hasMany(FeeStructure::class, 'class_id');
    }

    public function classRoutines(): HasMany
    {
        return $this->hasMany(ClassRoutine::class, 'class_id');
    }
}
