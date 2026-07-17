import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Languages, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ClassPivot = { full_marks: number; written_marks: number | null; mcq_marks: number | null; practical_marks: number | null; ca_marks: number | null; pass_marks: number; sort_order: number };
type Subject = { id: number; name: string; name_bn: string | null; code: string; type: string; classes: ({ id: number; name: string } & ClassPivot)[] };
type Props = { subject?: Subject; classes: { id: number; name: string }[]; isEdit: boolean };

const types = ['Compulsory', 'Optional', 'Elective', 'Practical'];

const defaultMarks = { full_marks: '100', written_marks: '', mcq_marks: '', practical_marks: '', ca_marks: '', pass_marks: '33', sort_order: '0' };

export default function Form({ subject, classes, isEdit }: Props) {
    const assignedMarks: Record<string, Record<string, string>> = {};
    if (subject) {
        for (const c of subject.classes) {
            assignedMarks[c.id.toString()] = {
                full_marks: c.pivot.full_marks.toString(),
                written_marks: c.pivot.written_marks?.toString() ?? '',
                mcq_marks: c.pivot.mcq_marks?.toString() ?? '',
                practical_marks: c.pivot.practical_marks?.toString() ?? '',
                ca_marks: c.pivot.ca_marks?.toString() ?? '',
                pass_marks: c.pivot.pass_marks.toString(),
                sort_order: c.pivot.sort_order.toString(),
            };
        }
    }

    const { data, setData, post, put, processing, errors } = useForm({
        class_ids: subject?.classes.map((c) => c.id.toString()) ?? [],
        marks: { ...assignedMarks },
        name: subject?.name ?? '',
        name_bn: subject?.name_bn ?? '',
        code: subject?.code ?? '',
        type: subject?.type ?? 'Compulsory',
    });

    const toggleClass = (id: string) => {
        const newIds = data.class_ids.includes(id)
            ? data.class_ids.filter((v) => v !== id)
            : [...data.class_ids, id];

        const newMarks = { ...data.marks };
        if (newIds.includes(id) && !newMarks[id]) {
            newMarks[id] = { ...defaultMarks };
        }
        if (!newIds.includes(id)) {
            delete newMarks[id];
        }
        setData({ ...data, class_ids: newIds, marks: newMarks });
    };

    const setClassMark = (classId: string, field: string, value: string) => {
        setData('marks', {
            ...data.marks,
            [classId]: { ...data.marks[classId], [field]: value },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && subject) put(`/subjects/${subject.id}`);
        else post('/subjects');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Subject' : 'Create Subject'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/subjects"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Subject' : 'Create Subject'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update subject information.' : 'Add a new subject.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label>Assign to Classes</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                            {classes.map((c) => (
                                <div key={c.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`class-${c.id}`}
                                        checked={data.class_ids.includes(c.id.toString())}
                                        onCheckedChange={() => toggleClass(c.id.toString())}
                                    />
                                    <Label htmlFor={`class-${c.id}`} className="text-sm font-normal cursor-pointer">{c.name}</Label>
                                </div>
                            ))}
                        </div>
                        {errors.class_ids && <p className="text-sm text-red-500">{errors.class_ids}</p>}
                    </div>

                    {data.class_ids.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Marks Configuration</Label>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="px-2 py-2 text-left font-medium">Class</th>
                                            <th className="px-2 py-2 text-left font-medium">Full</th>
                                            <th className="px-2 py-2 text-left font-medium">Written</th>
                                            <th className="px-2 py-2 text-left font-medium">MCQ</th>
                                            <th className="px-2 py-2 text-left font-medium">Practical</th>
                                            <th className="px-2 py-2 text-left font-medium">CA</th>
                                            <th className="px-2 py-2 text-left font-medium">Pass</th>
                                            <th className="px-2 py-2 text-left font-medium">Sort</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.class_ids.map((id) => {
                                            const cls = classes.find((c) => c.id.toString() === id);
                                            const m = data.marks[id] ?? defaultMarks;
                                            return (
                                                <tr key={id} className="border-b hover:bg-muted/30">
                                                    <td className="px-2 py-2 font-medium text-nowrap">{cls?.name}</td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.full_marks} onChange={(e) => setClassMark(id, 'full_marks', e.target.value)} /></td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.written_marks} onChange={(e) => setClassMark(id, 'written_marks', e.target.value)} /></td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.mcq_marks} onChange={(e) => setClassMark(id, 'mcq_marks', e.target.value)} /></td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.practical_marks} onChange={(e) => setClassMark(id, 'practical_marks', e.target.value)} /></td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.ca_marks} onChange={(e) => setClassMark(id, 'ca_marks', e.target.value)} /></td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.pass_marks} onChange={(e) => setClassMark(id, 'pass_marks', e.target.value)} /></td>
                                                    <td className="px-2 py-2"><Input type="number" className="h-8 w-16" value={m.sort_order} onChange={(e) => setClassMark(id, 'sort_order', e.target.value)} /></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name (English)</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Mathematics" required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="name_bn">Name (Bangla)</Label>
                                {data.name && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" onClick={async () => {
                                                try {
                                                    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(data.name)}`);
                                                    const json = await res.json();
                                                    const translated = json[0]?.[0]?.[0];
                                                    if (translated) setData('name_bn', translated);
                                                } catch {
                                                    setData('name_bn', data.name);
                                                }
                                            }} className="text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                                                <Languages className="size-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Translate from English</p></TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                            <Input id="name_bn" value={data.name_bn} onChange={(e) => setData('name_bn', e.target.value)} placeholder="e.g. গণিত" />
                            {errors.name_bn && <p className="text-sm text-red-500">{errors.name_bn}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="e.g. MATH-101" required />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/subjects">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Subjects', href: '/subjects' }, { title: 'Manage', href: '' }] };