<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::orderBy('module')->orderBy('name')->get()->groupBy('module');
        $roles = ['superadmin', 'admin', 'teacher', 'accountant', 'receptionist', 'librarian', 'student', 'parent'];

        $rolePermissions = RolePermission::all()->groupBy('role')->map(function ($items) {
            return $items->pluck('permission_id')->toArray();
        });

        return Inertia::render('school/permissions/index', [
            'permissions' => $permissions,
            'roles' => $roles,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'permission_id' => 'required|exists:permissions,id',
            'enabled' => 'required|boolean',
        ]);

        if ($validated['enabled']) {
            RolePermission::firstOrCreate([
                'role' => $validated['role'],
                'permission_id' => $validated['permission_id'],
            ]);
        } else {
            RolePermission::where('role', $validated['role'])
                ->where('permission_id', $validated['permission_id'])
                ->delete();
        }

        return redirect()->route('permissions.index')
            ->with('success', 'Permission updated.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:permissions,slug',
            'module' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Permission::create($validated);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission created.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        return redirect()->route('permissions.index')
            ->with('success', 'Permission deleted.');
    }
}
