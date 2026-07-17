import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Shield, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Props = {
    permissions: Record<string, { id: number; name: string; slug: string; module: string; description: string | null }[]>;
    roles: string[];
    rolePermissions: Record<string, number[]>;
};

export default function Index({ permissions, roles, rolePermissions }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        slug: '',
        module: '',
        description: '',
    });
    const [dialogOpen, setDialogOpen] = useState(false);

    const togglePermission = (role: string, permissionId: number, enabled: boolean) => {
        router.post('/permissions/toggle', {
            role, permission_id: permissionId, enabled,
        }, { preserveState: true });
    };

    const handleCreatePermission = (e: React.FormEvent) => {
        e.preventDefault();
        post('/permissions', {
            onSuccess: () => { setDialogOpen(false); reset(); },
        });
    };

    const deletePermission = (id: number) => {
        if (confirm('Delete this permission?')) router.delete(`/permissions/${id}`);
    };

    const roleColors: Record<string, string> = {
        superadmin: 'bg-red-100 text-red-800',
        admin: 'bg-purple-100 text-purple-800',
        teacher: 'bg-blue-100 text-blue-800',
        accountant: 'bg-green-100 text-green-800',
        receptionist: 'bg-yellow-100 text-yellow-800',
        librarian: 'bg-indigo-100 text-indigo-800',
        student: 'bg-cyan-100 text-cyan-800',
        parent: 'bg-pink-100 text-pink-800',
    };

    return (
        <>
            <Head title="Permissions & Roles" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Shield className="size-6 text-emerald-600" /> Permissions & Roles
                        </h1>
                        <p className="text-sm text-muted-foreground">Define which features each role can access.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 size-4" /> Add Permission</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add Permission</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreatePermission} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name <span className="text-red-500">*</span></Label>
                                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Create Student" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug <span className="text-red-500">*</span></Label>
                                    <Input value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="e.g. students.create" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Module <span className="text-red-500">*</span></Label>
                                    <Input value={data.module} onChange={(e) => setData('module', e.target.value)} placeholder="e.g. Students" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                </div>
                                <Button type="submit" disabled={processing}>Save</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Module / Permission</th>
                                {roles.map((role) => (
                                    <th key={role} className="px-3 py-3 text-center font-medium capitalize">
                                        <Badge variant="outline" className={roleColors[role] ?? ''}>{role}</Badge>
                                    </th>
                                ))}
                                <th className="px-3 py-3 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(permissions).map(([module, perms]) => (
                                <>
                                    <tr key={module} className="border-b bg-muted/20">
                                        <td colSpan={roles.length + 2} className="px-4 py-2 font-bold text-emerald-700 text-xs uppercase tracking-wider">{module}</td>
                                    </tr>
                                    {perms.map((perm) => (
                                        <tr key={perm.id} className="border-b last:border-0 hover:bg-muted/10">
                                            <td className="px-4 py-2.5">
                                                <p className="font-medium text-sm">{perm.name}</p>
                                                <p className="text-xs text-muted-foreground">{perm.slug}</p>
                                            </td>
                                            {roles.map((role) => {
                                                const hasPerm = (rolePermissions[role] ?? []).includes(perm.id);
                                                return (
                                                    <td key={role} className="px-3 py-2.5 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={hasPerm}
                                                            onChange={() => togglePermission(role, perm.id, !hasPerm)}
                                                            className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="px-3 py-2.5 text-center">
                                                <Button variant="ghost" size="icon" className="size-7" onClick={() => deletePermission(perm.id)} title="Delete">
                                                    <Trash2 className="size-3 text-red-500" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Permissions', href: '/permissions' }] };
