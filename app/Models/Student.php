<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'name_bn',
        'class_name',
        'class_id',
        'section',
        'section_id',
        'academic_year_id',
        'roll_no',
        'date_of_birth',
        'gender',
        'caste',
        'mobile_number',
        'religion',
        'nationality',
        'guardian_name',
        'guardian_phone',
        'mother_name',
        'mother_phone',
        'email',
        'birth_certificate_no',
        'previous_school',
        'admission_date',
        'district',
        'address',
        'blood_group',
        'house',
        'height',
        'weight',
        'measurement_date',
        'medical_history',
        'national_id',
        'local_id',
        'note',
        'transport_route_id',
        'transport_stop_id',
        'fees_month',
        'hostel_room_id',
        'photo',
        'father_photo',
        'mother_photo',
        'guardian_photo',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth'    => 'date:Y-m-d',
            'admission_date'   => 'date:Y-m-d',
            'measurement_date' => 'date:Y-m-d',
            'height'           => 'decimal:2',
            'weight'           => 'decimal:2',

        ];
    }

    public function reports(): HasMany
    {
        return $this->hasMany(AcademicReport::class);
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class, 'student_guardian')
            ->withTimestamps();
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function feeCollections(): HasMany
    {
        return $this->hasMany(FeeCollection::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function hostelAllocation(): HasMany
    {
        return $this->hasMany(HostelAllocation::class);
    }

    public function studentHouse(): BelongsTo
    {
        return $this->belongsTo(StudentHouse::class);
    }
}
