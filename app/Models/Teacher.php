<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'name',
        'name_bn',
        'gender',
        'date_of_birth',
        'blood_group',
        'address',
        'department',
        'designation',
        'qualification',
        'experience_years',
        'phone',
        'email',
        'photo',
        'user_id',
        'district',
        'joining_date',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date:Y-m-d',
            'joining_date' => 'date:Y-m-d',
            'experience_years' => 'integer',
        ];
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject')
            ->withPivot('class_id', 'is_class_teacher')
            ->withTimestamps();
    }

    public function schoolClasses(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 'teacher_subject')
            ->withPivot('subject_id', 'is_class_teacher')
            ->withTimestamps();
    }

    public function teacherSubjects(): HasMany
    {
        return $this->hasMany(TeacherSubject::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(TeacherAttendance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function salaryStructure(): HasOne
    {
        return $this->hasOne(SalaryStructure::class);
    }

    public function salaryPayments(): HasMany
    {
        return $this->hasMany(SalaryPayment::class);
    }
}
