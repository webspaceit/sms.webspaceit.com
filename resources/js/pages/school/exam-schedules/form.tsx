import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

type Section = { id: number; class_id: number; name: string; room_no: string | null };
type ExamSchedule = { id: number; exam_id: number; class_id: number; subject_id: number; date: string; start_time: string; end_time: string; hall_id: number | null };
type Props = { schedule?: ExamSchedule; exams: { id: number; name: string }[]; classes: { id: number; name: string }[]; subjects: { id: number; name: string; code: string }[]; classSubjects: Record<string, number[]>; sections: Section[]; isEdit: boolean };

export default function Form({ schedule, exams, classes, subjects, classSubjects, sections, isEdit }: Props) {
    const [selectedClassId, setSelectedClassId] = useState(schedule?.class_id?.toString() ?? '');

    const availableSubjectIds = selectedClassId ? (classSubjects[selectedClassId] ?? []) : [];
    const filteredSubjects = selectedClassId
        ? subjects.filter((s) => availableSubjectIds.includes(s.id))
        : subjects;

    const halls = sections.map((s) => ({ value: s.id.toString(), label: s.room_no ? `${s.name} (Room ${s.room_no})` : s.name }));

    const { data, setData, post, put, processing, errors } = useForm({
        exam_id: schedule?.exam_id?.toString() ?? '',
        class_id: schedule?.class_id?.toString() ?? '',
        subject_id: schedule?.subject_id?.toString() ?? '',
        date: schedule?.date ?? '',
        start_time: schedule?.start_time ?? '',
        end_time: schedule?.end_time ?? '',
        hall_id: schedule?.hall_id?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && schedule) put(`/exam-schedules/${schedule.id}`);
        else post('/exam-schedules');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Exam Schedule' : 'Create Exam Schedule'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/exam-schedules"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Schedule' : 'Create Schedule'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update schedule.' : 'Schedule a subject for an exam.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="exam_id">Exam</Label>
                            <Select value={data.exam_id} onValueChange={(val) => setData('exam_id', val)}>
                                <SelectTrigger id="exam_id"><SelectValue placeholder="Select exam..." /></SelectTrigger>
                                <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.exam_id && <p className="text-sm text-red-500">{errors.exam_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class</Label>
                            <SearchableSelect
                                options={classes.map((c) => ({ value: c.id.toString(), label: c.name }))}
                                value={selectedClassId}
                                onChange={(val) => { setSelectedClassId(val); setData('class_id', val); setData('subject_id', ''); }}
                                placeholder="Select class..."
                            />
                            {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject_id">Subject</Label>
                            <SearchableSelect
                                options={filteredSubjects.map((s) => ({ value: s.id.toString(), label: `${s.name} (${s.code})` }))}
                                value={data.subject_id}
                                onChange={(val) => setData('subject_id', val)}
                                placeholder={selectedClassId ? 'Select subject...' : 'Select a class first'}
                            />
                            {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input id="start_time" type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} required />
                            {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input id="end_time" type="time" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} required />
                            {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hall_id">Hall Room</Label>
                            <Select value={data.hall_id} onValueChange={(val) => setData('hall_id', val)}>
                                <SelectTrigger id="hall_id"><SelectValue placeholder="Not Selected" /></SelectTrigger>
                                <SelectContent>
                                    {halls.map((h) => (
                                        <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/exam-schedules">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Exam Schedules', href: '/exam-schedules' }, { title: 'Manage', href: '' }] };
