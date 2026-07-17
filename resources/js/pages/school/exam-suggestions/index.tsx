import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Suggestion = {
    id: number;
    title: string;
    suggestion: string | null;
    file_path: string | null;
    exam: { id: number; name: string } | null;
    subject: { id: number; name: string } | null;
    teacher: { id: number; name: string } | null;
    created_at: string;
};

type Props = {
    suggestions: Suggestion[];
    exams: { id: number; name: string }[];
    filters: { exam_id?: string };
};

export default function Index({ suggestions, exams, filters }: Props) {
    const [filterExam, setFilterExam] = useState(filters?.exam_id ?? '');

    const handleFilter = () => {
        router.get('/exam-suggestions', { exam_id: filterExam }, { preserveState: true });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Delete suggestion "${title}"?`)) router.delete(`/exam-suggestions/${id}`);
    };

    return (
        <>
            <Head title="Exam Suggestions" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <FileText className="size-6 text-indigo-600" /> Exam Suggestions
                        </h1>
                        <p className="text-sm text-muted-foreground">Upload and manage exam suggestions by subject.</p>
                    </div>
                    <Button asChild>
                        <Link href="/exam-suggestions/create"><Plus className="mr-2 size-4" /> Add Suggestion</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filterExam} onValueChange={setFilterExam}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="All Exams" /></SelectTrigger>
                        <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="secondary" onClick={handleFilter} size="sm">Filter</Button>
                    {filters?.exam_id && (
                        <Button variant="ghost" size="sm" onClick={() => { setFilterExam(''); router.get('/exam-suggestions'); }}>Clear</Button>
                    )}
                </div>

                <section className="rounded-lg border bg-card">
                    {suggestions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <FileText className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No exam suggestions yet</p>
                            <p className="text-sm">Upload the first suggestion for an exam.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Title</th>
                                    <th className="px-4 py-3 font-medium">Exam</th>
                                    <th className="px-4 py-3 font-medium">Subject</th>
                                    <th className="px-4 py-3 font-medium">Teacher</th>
                                    <th className="px-4 py-3 font-medium">File</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suggestions.map((s) => (
                                    <tr key={s.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">{s.title}</td>
                                        <td className="px-4 py-3">{s.exam?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{s.subject?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{s.teacher?.name ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            {s.file_path ? (
                                                <a href={`/storage/${s.file_path}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                                                    <ExternalLink className="size-3.5" /> View
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(s.id, s.title)} title="Delete">
                                                <Trash2 className="size-3.5 text-red-500" />
                                            </Button>
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

Index.layout = { breadcrumbs: [{ title: 'Exam Suggestions', href: '/exam-suggestions' }] };
