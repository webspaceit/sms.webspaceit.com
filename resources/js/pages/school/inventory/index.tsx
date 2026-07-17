import { Head, Link, router, useForm } from '@inertiajs/react';
import { Box, Edit3, Plus, Search, Trash2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Category = { id: number; name: string; description: string | null; items_count: number };
type Item = {
    id: number; name: string; category_id: number | null; quantity: number;
    minimum_quantity: number; unit_price: string; description: string | null;
    category: { id: number; name: string } | null;
};

type Props = {
    items: Item[];
    categories: { id: number; name: string }[];
    filters: { category_id?: string; search?: string };
};

export default function Index({ items, categories, filters }: Props) {
    const [catFilter, setCatFilter] = useState(filters?.category_id ?? '');
    const [search, setSearch] = useState(filters?.search ?? '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: 0,
        name: '',
        category_id: '',
        quantity: '0',
        minimum_quantity: '0',
        unit_price: '0',
        description: '',
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [catDialogOpen, setCatDialogOpen] = useState(false);
    const { data: catData, setData: setCatData, post: catPost, processing: catProcessing } = useForm({ name: '', description: '' });

    const isEditing = data.id > 0;

    const handleFilter = () => {
        router.get('/inventory', { category_id: catFilter, search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete "${name}"?`)) router.delete(`/inventory/${id}`);
    };

    const openEdit = (item: Item) => {
        setData({
            id: item.id, name: item.name, category_id: item.category_id?.toString() ?? '',
            quantity: item.quantity.toString(), minimum_quantity: item.minimum_quantity.toString(),
            unit_price: item.unit_price.toString(), description: item.description ?? '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/inventory/${data.id}`, { onSuccess: () => { setDialogOpen(false); reset(); } });
        } else {
            post('/inventory', { onSuccess: () => { setDialogOpen(false); reset(); } });
        }
    };

    const handleCatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        catPost('/inventory/categories', { onSuccess: () => { setCatDialogOpen(false); setCatData({ name: '', description: '' }); } });
    };

    return (
        <>
            <Head title="Inventory" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Box className="size-6 text-emerald-600" /> Inventory
                        </h1>
                        <p className="text-sm text-muted-foreground">Track textbooks, uniforms, stationery, and other items.</p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
                            <DialogTrigger asChild><Button variant="outline"><Plus className="mr-2 size-4" /> Category</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
                                <form onSubmit={handleCatSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Name <span className="text-red-500">*</span></Label>
                                        <Input value={catData.name} onChange={(e) => setCatData('name', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={catData.description} onChange={(e) => setCatData('description', e.target.value)} rows={2} />
                                    </div>
                                    <Button type="submit" disabled={catProcessing}>Save</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { reset(); setData('id', 0); }}><Plus className="mr-2 size-4" /> Add Item</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader><DialogTitle>{isEditing ? 'Edit Item' : 'Add Item'}</DialogTitle></DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Name <span className="text-red-500">*</span></Label>
                                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Unit Price</Label>
                                            <Input type="number" min="0" step="0.01" value={data.unit_price} onChange={(e) => setData('unit_price', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Quantity <span className="text-red-500">*</span></Label>
                                            <Input type="number" min="0" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Min. Quantity</Label>
                                            <Input type="number" min="0" value={data.minimum_quantity} onChange={(e) => setData('minimum_quantity', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} />
                                    </div>
                                    <Button type="submit" disabled={processing}>{isEditing ? 'Update' : 'Save'}</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={catFilter} onValueChange={setCatFilter}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input className="w-44" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFilter()} />
                    <Button variant="secondary" size="sm" onClick={handleFilter}><Search className="mr-1 size-3.5" /> Filter</Button>
                    {(filters?.category_id || filters?.search) && (
                        <Button variant="ghost" size="sm" onClick={() => { setCatFilter(''); setSearch(''); router.get('/inventory'); }}>Clear</Button>
                    )}
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.length === 0 ? (
                        <div className="col-span-full rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <Box className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No inventory items</p>
                            <p className="text-sm">Add your first inventory item.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <article key={item.id} className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold truncate">{item.name}</h3>
                                        {item.category && <p className="text-xs text-muted-foreground">{item.category.name}</p>}
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(item)} title="Edit">
                                            <Edit3 className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(item.id, item.name)} title="Delete">
                                            <Trash2 className="size-3.5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold">{item.quantity}</span>
                                        <span className="text-sm text-muted-foreground ml-1">in stock</span>
                                    </div>
                                    {item.quantity <= item.minimum_quantity && (
                                        <Badge variant="destructive" className="flex items-center gap-1">
                                            <TriangleAlert className="size-3" /> Low Stock
                                        </Badge>
                                    )}
                                </div>
                                {item.unit_price !== '0' && (
                                    <p className="text-xs text-muted-foreground mt-1">৳{parseFloat(item.unit_price).toFixed(2)} / unit</p>
                                )}
                                {item.description && (
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                                )}
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Inventory', href: '/inventory' }] };
