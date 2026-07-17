import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Designation = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
};

export default function DesignationsIndex({ designations }: { designations: Designation[] }) {
    const [editing, setEditing] = useState<Designation | null>(null);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', is_active: true });

    const resetForm = () => {
        setForm({ name: '', description: '', is_active: true });
        setEditing(null);
    };

    const openEdit = (d: Designation) => {
        setEditing(d);
        setForm({ name: d.name, description: d.description || '', is_active: d.is_active });
        setOpen(true);
    };

    const handleSave = () => {
        if (editing) {
            router.put(`/designations/${editing.id}`, form, {
                onSuccess: () => { setOpen(false); resetForm(); },
            });
        } else {
            router.post('/designations', form, {
                onSuccess: () => { setOpen(false); resetForm(); },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this designation?')) {
            router.delete(`/designations/${id}`);
        }
    };

    return (
        <>
            <Head title="Designations" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Designations</h1>
                    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 size-4" /> Add Designation</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Senior Teacher" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="size-4" />
                                    <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
                                    <Button onClick={handleSave}>{editing ? 'Update' : 'Save'}</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/60 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Description</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {designations.length === 0 ? (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No designations yet.</td></tr>
                            ) : designations.map((d) => (
                                <tr key={d.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{d.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{d.description || '-'}</td>
                                    <td className="px-4 py-3">
                                        {d.is_active
                                            ? <CheckCircle2 className="size-5 text-green-600" />
                                            : <XCircle className="size-5 text-red-500" />}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="size-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="size-4 text-red-500" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}

DesignationsIndex.layout = {
    breadcrumbs: [
        { title: 'Designations', href: '/designations' },
    ],
};
