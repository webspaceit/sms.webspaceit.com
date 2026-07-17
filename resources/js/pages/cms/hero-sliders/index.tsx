import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Edit3, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Slider = {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
    button_text: string | null;
    button_url: string | null;
    sort_order: number;
    is_active: boolean;
};

export default function HeroSliders({ sliders }: { sliders: Slider[] }) {
    const { errors } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Slider | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        button_text: '',
        button_url: '',
        sort_order: 0,
        is_active: true,
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        setOpen(true);
    };

    const openEdit = (slider: Slider) => {
        setEditing(slider);
        setData({
            title: slider.title,
            subtitle: slider.subtitle ?? '',
            description: '',
            image: slider.image ?? '',
            button_text: slider.button_text ?? '',
            button_url: slider.button_url ?? '',
            sort_order: slider.sort_order,
            is_active: slider.is_active,
        });
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            put(`/hero-sliders/${editing.id}`, {
                onSuccess: () => { setOpen(false); reset(); },
            });
        } else {
            post('/hero-sliders', {
                onSuccess: () => { setOpen(false); reset(); },
            });
        }
    };

    const toggleActive = (slider: Slider) => {
        put(`/hero-sliders/${slider.id}`, {
            data: { ...slider, is_active: !slider.is_active, description: '' },
        });
    };

    const deleteSlider = (slider: Slider) => {
        if (confirm('Delete this slider?')) {
            router.delete(`/hero-sliders/${slider.id}`);
        }
    };

    return (
        <>
            <Head title="Hero Sliders" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Hero Sliders</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the hero slider images on the front site.
                        </p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate}>
                                <Plus className="mr-2 size-4" /> Add Slider
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editing ? 'Edit Slider' : 'New Slider'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Input
                                        id="subtitle"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input
                                        id="image"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="button_text">Button Text</Label>
                                    <Input
                                        id="button_text"
                                        value={data.button_text}
                                        onChange={(e) => setData('button_text', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="button_url">Button URL</Label>
                                    <Input
                                        id="button_url"
                                        value={data.button_url}
                                        onChange={(e) => setData('button_url', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {editing ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Subtitle</TableHead>
                                <TableHead>Button</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sliders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No sliders yet. Click "Add Slider" to create one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sliders.map((slider) => (
                                    <TableRow key={slider.id}>
                                        <TableCell>{slider.sort_order}</TableCell>
                                        <TableCell className="font-medium">{slider.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{slider.subtitle}</TableCell>
                                        <TableCell>{slider.button_text ? `${slider.button_text} →` : '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={slider.is_active ? 'default' : 'secondary'}>
                                                {slider.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => toggleActive(slider)}>
                                                    {slider.is_active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(slider)}>
                                                    <Edit3 className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteSlider(slider)}>
                                                    <Trash2 className="size-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

HeroSliders.layout = { breadcrumbs: [{ title: 'Hero Sliders', href: '/hero-sliders' }] };
