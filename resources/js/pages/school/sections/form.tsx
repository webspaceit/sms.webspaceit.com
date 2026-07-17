import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type Section = { id: number; class_id: number; name: string; room_no: string | null };
type Props = { section?: Section; classes: { id: number; name: string }[]; isEdit: boolean };

export default function Form({ section, classes, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        class_id: section?.class_id?.toString() ?? '',
        name: section?.name ?? '',
        room_no: section?.room_no ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && section) put(`/sections/${section.id}`);
        else post('/sections');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Section' : 'Create Section'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/sections"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Section' : 'Create Section'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update section information.' : 'Add a new section.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="class_id">Class</Label>
                        <SearchableSelect
                            options={classes.map((c) => ({ value: c.id.toString(), label: c.name }))}
                            value={data.class_id}
                            onChange={(val) => setData('class_id', val)}
                            placeholder="Select class..."
                        />
                        {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Section Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Shapla" required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="room_no">Room No</Label>
                            <Input id="room_no" value={data.room_no} onChange={(e) => setData('room_no', e.target.value)} placeholder="e.g. 201" />
                            {errors.room_no && <p className="text-sm text-red-500">{errors.room_no}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/sections">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Sections', href: '/sections' }, { title: 'Manage', href: '' }] };
