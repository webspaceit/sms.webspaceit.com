import { Head, Link, router } from '@inertiajs/react';
import { Plus, ScrollText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LessonPlan = {
    id: number;
    topic: string;
    topic_overview: string | null;
    lesson_breakdown: string | null;
    lesson_date: string | null;
    class: { id: number; name: string } | null;
    subject: { id: number; name: string } | null;
    teacher: { id: number; name: string } | null;
    created_at: string;
};

type Props = {
    lessonPlans: LessonPlan[];
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    filters: { class_id?: string; subject_id?: string };
};

export default function Index({ lessonPlans, classes, subjects, filters }: Props) {
    const [filterClass, setFilterClass] = useState(filters?.class_id ?? '');
    const [filterSubject, setFilterSubject] = useState(filters?.subject_id ?? '');

    const handleFilter = () => {
        router.get('/lesson-plans', { class_id: filterClass, subject_id: filterSubject }, { preserveState: true });
    };

    const handleDelete = (id: number, topic: string) => {
        if (confirm(`Delete lesson plan "${topic}"?`)) router.delete(`/lesson-plans/${id}`);
    };

    return (
        <>
            <Head title="Lesson Plans" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <ScrollText className="size-6 text-emerald-600" /> Lesson Plans
                        </h1>
                        <p className="text-sm text-muted-foreground">Plan and manage lessons for each class and subject.</p>
                    </div>
                    <Button asChild>
                        <Link href="/lesson-plans/create"><Plus className="mr-2 size-4" /> Add Lesson Plan</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterSubject(''); }}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                        <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="secondary" onClick={handleFilter} size="sm">Filter</Button>
                    {(filters?.class_id || filters?.subject_id) && (
                        <Button variant="ghost" size="sm" onClick={() => { setFilterClass(''); setFilterSubject(''); router.get('/lesson-plans'); }}>Clear</Button>
                    )}
                </div>

                <section className="rounded-lg border bg-card">
                    {lessonPlans.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <ScrollText className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No lesson plans yet</p>
                            <p className="text-sm">Create the first lesson plan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Topic</th>
                                    <th className="px-4 py-3 font-medium">Class</th>
                                    <th className="px-4 py-3 font-medium">Subject</th>
                                    <th className="px-4 py-3 font-medium">Teacher</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessonPlans.map((lp) => (
                                    <tr key={lp.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">{lp.topic}</td>
                                        <td className="px-4 py-3">{lp.class?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{lp.subject?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{lp.teacher?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{lp.lesson_date ? new Date(lp.lesson_date).toLocaleDateString() : '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/lesson-plans/${lp.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(lp.id, lp.topic)} title="Delete">
                                                    <Trash2 className="size-3.5 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Lesson Plans', href: '/lesson-plans' }] };
