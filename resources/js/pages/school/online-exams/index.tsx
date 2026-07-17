import { Head, Link, router } from '@inertiajs/react';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OnlineExam = {
    id: number; title: string; duration_minutes: number; total_marks: number;
    status: string; start_time: string | null; end_time: string | null;
    class: { id: number; name: string } | null;
    subject: { id: number; name: string } | null;
    questions_count?: number;
};

type Props = {
    exams: OnlineExam[];
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    filters: { status?: string };
};

const statusColor: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-blue-100 text-blue-800',
};

export default function Index({ exams, classes, subjects, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Delete exam "${title}"?`)) router.delete(`/online-exams/${id}`);
    };

    const handleFilter = () => {
        router.get('/online-exams', { status: statusFilter }, { preserveState: true });
    };

    return (
        <>
            <Head title="Online Exams" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Globe className="size-6 text-emerald-600" /> Online Examinations
                        </h1>
                        <p className="text-sm text-muted-foreground">Create and manage online exams for students.</p>
                    </div>
                    <Button asChild><Link href="/online-exams/create"><Plus className="mr-2 size-4" /> Create Exam</Link></Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="secondary" size="sm" onClick={handleFilter}>Filter</Button>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.length === 0 ? (
                        <div className="col-span-full rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <Globe className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No online exams yet</p>
                        </div>
                    ) : (
                        exams.map((exam) => (
                            <article key={exam.id} className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold truncate">{exam.title}</h3>
                                        <div className="flex gap-2 mt-1">
                                            {exam.class && <span className="text-xs text-muted-foreground">{exam.class.name}</span>}
                                            {exam.subject && <span className="text-xs text-muted-foreground">{exam.subject.name}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(exam.id, exam.title)} title="Delete">
                                            <Trash2 className="size-3.5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <Badge variant="outline" className={statusColor[exam.status]}>{exam.status}</Badge>
                                    <span className="text-xs text-muted-foreground">{exam.duration_minutes} min | {exam.total_marks} marks</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <Link href={`/online-exams/${exam.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <Link href={`/online-exams/${exam.id}/questions`}>Questions</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <Link href={`/online-exams/${exam.id}/results`}>Results</Link>
                                    </Button>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Online Exams', href: '/online-exams' }] };
