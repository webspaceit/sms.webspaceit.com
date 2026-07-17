<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'View Students', 'slug' => 'students.view', 'module' => 'Students'],
            ['name' => 'Create Student', 'slug' => 'students.create', 'module' => 'Students'],
            ['name' => 'Edit Student', 'slug' => 'students.edit', 'module' => 'Students'],
            ['name' => 'Delete Student', 'slug' => 'students.delete', 'module' => 'Students'],
            ['name' => 'View Teachers', 'slug' => 'teachers.view', 'module' => 'Teachers'],
            ['name' => 'Create Teacher', 'slug' => 'teachers.create', 'module' => 'Teachers'],
            ['name' => 'Edit Teacher', 'slug' => 'teachers.edit', 'module' => 'Teachers'],
            ['name' => 'Delete Teacher', 'slug' => 'teachers.delete', 'module' => 'Teachers'],
            ['name' => 'Manage Classes', 'slug' => 'classes.manage', 'module' => 'Academic'],
            ['name' => 'Manage Subjects', 'slug' => 'subjects.manage', 'module' => 'Academic'],
            ['name' => 'Manage Exams', 'slug' => 'exams.manage', 'module' => 'Exams'],
            ['name' => 'View Reports', 'slug' => 'reports.view', 'module' => 'Exams'],
            ['name' => 'Manage Fees', 'slug' => 'fees.manage', 'module' => 'Finance'],
            ['name' => 'Manage Attendance', 'slug' => 'attendance.manage', 'module' => 'Attendance'],
            ['name' => 'View Notice Board', 'slug' => 'notices.view', 'module' => 'Communication'],
            ['name' => 'Create Notice', 'slug' => 'notices.create', 'module' => 'Communication'],
            ['name' => 'Manage Library', 'slug' => 'library.manage', 'module' => 'Facilities'],
            ['name' => 'Manage Transport', 'slug' => 'transport.manage', 'module' => 'Facilities'],
            ['name' => 'Manage Hostel', 'slug' => 'hostel.manage', 'module' => 'Facilities'],
            ['name' => 'Manage Inventory', 'slug' => 'inventory.manage', 'module' => 'Facilities'],
            ['name' => 'Manage Accounts', 'slug' => 'accounts.manage', 'module' => 'Finance'],
            ['name' => 'Manage Settings', 'slug' => 'settings.manage', 'module' => 'Settings'],
            ['name' => 'Manage Permissions', 'slug' => 'permissions.manage', 'module' => 'Settings'],
            ['name' => 'View ID Cards', 'slug' => 'id-cards.view', 'module' => 'Exams'],
            ['name' => 'Manage Certificates', 'slug' => 'certificates.manage', 'module' => 'Exams'],
            ['name' => 'Manage Study Materials', 'slug' => 'study-materials.manage', 'module' => 'Academic'],
            ['name' => 'Manage Lesson Plans', 'slug' => 'lesson-plans.manage', 'module' => 'Academic'],
            ['name' => 'Manage Holidays', 'slug' => 'holidays.manage', 'module' => 'Communication'],
            ['name' => 'Manage Events', 'slug' => 'events.manage', 'module' => 'Communication'],
            ['name' => 'Manage Complaints', 'slug' => 'complaints.manage', 'module' => 'Communication'],
            ['name' => 'Manage Exam Attendance', 'slug' => 'exam-attendance.manage', 'module' => 'Exams'],
            ['name' => 'Manage Staff Attendance', 'slug' => 'staff-attendance.manage', 'module' => 'Attendance'],
            ['name' => 'Manage Payroll', 'slug' => 'payroll.manage', 'module' => 'Finance'],
            ['name' => 'Manage Exam Suggestions', 'slug' => 'exam-suggestions.manage', 'module' => 'Exams'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['slug' => $perm['slug']], $perm);
        }

        $superadminRoles = ['superadmin', 'admin'];
        $allPermissions = Permission::pluck('id');

        foreach ($superadminRoles as $role) {
            foreach ($allPermissions as $permId) {
                RolePermission::firstOrCreate(['role' => $role, 'permission_id' => $permId]);
            }
        }

        $teacherPermissions = Permission::whereIn('slug', [
            'students.view', 'teachers.view', 'classes.manage', 'subjects.manage',
            'exams.manage', 'reports.view', 'attendance.manage', 'notices.view',
            'id-cards.view', 'study-materials.manage', 'lesson-plans.manage',
            'exam-suggestions.manage', 'exam-attendance.manage',
            'certificates.manage', 'events.manage', 'holidays.manage',
        ])->pluck('id');

        foreach ($teacherPermissions as $permId) {
            RolePermission::firstOrCreate(['role' => 'teacher', 'permission_id' => $permId]);
        }

        $accountantPermissions = Permission::whereIn('slug', [
            'fees.manage', 'accounts.manage', 'reports.view', 'students.view',
            'teachers.view', 'payroll.manage',
        ])->pluck('id');

        foreach ($accountantPermissions as $permId) {
            RolePermission::firstOrCreate(['role' => 'accountant', 'permission_id' => $permId]);
        }

        $receptionistPermissions = Permission::whereIn('slug', [
            'students.view', 'students.create', 'students.edit',
            'attendance.manage', 'notices.view', 'fees.manage',
        ])->pluck('id');

        foreach ($receptionistPermissions as $permId) {
            RolePermission::firstOrCreate(['role' => 'receptionist', 'permission_id' => $permId]);
        }

        $librarianPermissions = Permission::whereIn('slug', [
            'library.manage', 'students.view', 'teachers.view',
        ])->pluck('id');

        foreach ($librarianPermissions as $permId) {
            RolePermission::firstOrCreate(['role' => 'librarian', 'permission_id' => $permId]);
        }
    }
}
