import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Branch = {
    id: number; name: string; address: string | null; phone: string | null;
    email: string | null; is_main: boolean; status: string;
};

type Props = { branches: Branch[] };

export default function Index({ branches }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data, setData, post, put, processing, reset } = useForm({
        id: 0, name: '', address: '', phone: '', email: '', is_main: false, status: 'active',
    });

    const isEditing = data.id > 0;

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete branch "${name}"?`)) router.delete(`/branches/${id}`);
    };

    const openEdit = (b: Branch) => {
        setData({ id: b.id, name: b.name, address: b.address ?? '', phone: b.phone ?? '', email: b.email ?? '', is_main: b.is_main, status: b.status });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/branches/${data.id}`, { onSuccess: () => { setDialogOpen(false); reset(); setData('id', 0); } });
        } else {
            post('/branches', { onSuccess: () => { setDialogOpen(false); reset(); } });
        }
    };

    return (
        <>
            <Head title="Branches" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Building2 className="size-6 text-emerald-600" /> Branches
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage school branches and campuses.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { reset(); setData('id', 0); }}><Plus className="mr-2 size-4" /> Add Branch</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>{isEditing ? 'Edit Branch' : 'Add Branch'}</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name <span className="text-red-500">*</span></Label>
                                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.is_main} onChange={(e) => setData('is_main', e.target.checked)} className="size-4" id="is_main" />
                                    <Label htmlFor="is_main">Main Branch</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <Button type="submit" disabled={processing}>{isEditing ? 'Update' : 'Save'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {branches.length === 0 ? (
                        <div className="col-span-full rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <Building2 className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No branches yet</p>
                        </div>
                    ) : (
                        branches.map((b) => (
                            <article key={b.id} className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{b.name}{b.is_main && <Badge className="ml-2 bg-emerald-600">Main</Badge>}</h3>
                                        {b.address && <p className="text-xs text-muted-foreground mt-1">{b.address}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(b)}><Edit3 className="size-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(b.id, b.name)}><Trash2 className="size-3.5 text-red-500" /></Button>
                                    </div>
                                </div>
                                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                                    {b.phone && <span>{b.phone}</span>}
                                    {b.email && <span>{b.email}</span>}
                                </div>
                                <div className="mt-2">
                                    <Badge variant="outline" className={b.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}>{b.status}</Badge>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Branches', href: '/branches' }] };
