import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

type SectionItem = { id: number; name: string; class_id: number };
type ClassRoutine = { id: number; class_id: number; section_id: number; day_of_week: string; subject_id: number; teacher_id: number; start_time: string; end_time: string; room: string | null };
type Props = { routine?: ClassRoutine; classes: { id: number; name: string }[]; sections: SectionItem[]; subjects: { id: number; name: string }[]; teachers: { id: number; name: string }[]; isEdit: boolean };

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export default function Form({ routine, classes, sections, subjects, teachers, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        class_id: routine?.class_id?.toString() ?? '',
        section_id: routine?.section_id?.toString() ?? '',
        day_of_week: routine?.day_of_week ?? '',
        subject_id: routine?.subject_id?.toString() ?? '',
        teacher_id: routine?.teacher_id?.toString() ?? '',
        start_time: routine?.start_time ?? '',
        end_time: routine?.end_time ?? '',
        room: routine?.room ?? '',
    });

    const filteredSections = sections.filter((s) => s.class_id.toString() === data.class_id);

    const handleClassChange = (val: string) => {
        setData('class_id', val);
        setData('section_id', '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && routine) put(`/class-routines/${routine.id}`);
        else post('/class-routines');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Routine' : 'Add Routine Entry'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/class-routines"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Routine Entry' : 'Add Routine Entry'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update timetable entry.' : 'Add a new class routine entry.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class</Label>
                            <Select value={data.class_id} onValueChange={handleClassChange}>
                                <SelectTrigger id="class_id"><SelectValue placeholder="Select class..." /></SelectTrigger>
                                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section_id">Section</Label>
                            {data.class_id ? (
                                <Select value={data.section_id} onValueChange={(val) => setData('section_id', val)}>
                                    <SelectTrigger id="section_id"><SelectValue placeholder="Select section..." /></SelectTrigger>
                                    <SelectContent>{filteredSections.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-muted-foreground pt-2">Select a class first</p>
                            )}
                            {errors.section_id && <p className="text-sm text-red-500">{errors.section_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="day_of_week">Day</Label>
                            <Select value={data.day_of_week} onValueChange={(val) => setData('day_of_week', val)}>
                                <SelectTrigger id="day_of_week"><SelectValue placeholder="Select day..." /></SelectTrigger>
                                <SelectContent>{days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.day_of_week && <p className="text-sm text-red-500">{errors.day_of_week}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject_id">Subject</Label>
                            <Select value={data.subject_id} onValueChange={(val) => setData('subject_id', val)}>
                                <SelectTrigger id="subject_id"><SelectValue placeholder="Select subject..." /></SelectTrigger>
                                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="teacher_id">Teacher</Label>
                            <SearchableSelect
                                options={teachers.map((t) => ({ value: t.id.toString(), label: t.name }))}
                                value={data.teacher_id}
                                onChange={(val) => setData('teacher_id', val)}
                                placeholder="Select teacher..."
                            />
                            {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                        </div>
                        <div className="space-y-2"><Label htmlFor="start_time">Start Time</Label><Input id="start_time" type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} required />{errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="end_time">End Time</Label><Input id="end_time" type="time" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} required />{errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="room">Room</Label><Input id="room" value={data.room} onChange={(e) => setData('room', e.target.value)} placeholder="e.g. 201" />{errors.room && <p className="text-sm text-red-500">{errors.room}</p>}</div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/class-routines">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Class Routines', href: '/class-routines' }, { title: 'Manage', href: '' }] };
