import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Submission = {
    id: number; score: number | null; total_marks: number; submitted_at: string | null;
    student: { id: number; name: string; student_id: string; roll_no: number } | null;
};

type Props = {
    onlineExam: {
        id: number; title: string; total_marks: number; status: string;
        class: { name: string } | null;
        subject: { name: string } | null;
        submissions: Submission[];
    };
};

export default function Results({ onlineExam }: Props) {
    return (
        <>
            <Head title={`Results - ${onlineExam.title}`} />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/online-exams"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{onlineExam.title} - Results</h1>
                        <p className="text-sm text-muted-foreground">
                            {onlineExam.class?.name ?? 'All classes'} | {onlineExam.subject?.name ?? 'All subjects'} | {onlineExam.submissions.length} submissions
                        </p>
                    </div>
                </div>

                <section className="rounded-lg border bg-card">
                    {onlineExam.submissions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Award className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No submissions yet</p>
                            <p className="text-sm">Students have not taken this exam yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Student</th>
                                    <th className="px-4 py-3 font-medium">Student ID</th>
                                    <th className="px-4 py-3 font-medium">Roll</th>
                                    <th className="px-4 py-3 font-medium">Score</th>
                                    <th className="px-4 py-3 font-medium">Percentage</th>
                                    <th className="px-4 py-3 font-medium">Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {onlineExam.submissions.map((s) => {
                                    const pct = s.total_marks > 0 ? Math.round((s.score ?? 0) / s.total_marks * 100) : 0;
                                    return (
                                        <tr key={s.id} className="border-b last:border-0">
                                            <td className="px-4 py-3 font-medium">{s.student?.name ?? '—'}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{s.student?.student_id ?? '—'}</td>
                                            <td className="px-4 py-3">{s.student?.roll_no ?? '—'}</td>
                                            <td className="px-4 py-3">{s.score ?? '—'} / {s.total_marks}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={pct >= 80 ? 'default' : pct >= 40 ? 'secondary' : 'destructive'}>
                                                    {pct}%
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

Results.layout = { breadcrumbs: [{ title: 'Online Exams', href: '/online-exams' }, { title: 'Results', href: '' }] };
