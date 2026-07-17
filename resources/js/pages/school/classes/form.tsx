import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type SectionItem = { id: number; name: string };
type ClassItem = { id: number; name: string; shift?: string; sections?: SectionItem[] };
type Props = { item?: ClassItem; isEdit: boolean; sectionOptions?: string[] };

export default function Form({ item, isEdit, sectionOptions }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: item?.name ?? '',
        shift: item?.shift ?? 'Morning',
        sections: item?.sections?.map((s) => s.name) ?? [],
    });

    const toggleSection = (name: string) => {
        setData(
            'sections',
            data.sections.includes(name)
                ? data.sections.filter((s) => s !== name)
                : [...data.sections, name]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && item) put(`/classes/${item.id}`);
        else post('/classes');
    };

    const options = sectionOptions ?? ['A', 'B', 'C', 'D', 'E'];

    return (
        <>
            <Head title={isEdit ? 'Edit Class' : 'Create Class'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/classes"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Class' : 'Create Class'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update class information.' : 'Add a new class.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Six" required />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="shift">Shift</Label>
                        <select
                            id="shift"
                            value={data.shift}
                            onChange={(e) => setData('shift', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Morning">Morning</option>
                            <option value="Day">Day</option>
                            <option value="Both">Both</option>
                        </select>
                        {errors.shift && <p className="text-sm text-red-500">{errors.shift}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Sections <span className="text-red-500">*</span></Label>
                        <div className="space-y-1.5 pt-1">
                            {options.map((name) => (
                                <div key={name} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`section-${name}`}
                                        checked={data.sections.includes(name)}
                                        onCheckedChange={() => toggleSection(name)}
                                    />
                                    <Label htmlFor={`section-${name}`} className="text-sm font-normal cursor-pointer">
                                        {name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.sections && <p className="text-sm text-red-500">{errors.sections}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/classes">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Classes', href: '/classes' }, { title: 'Manage', href: '' }] };
