import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, FileSpreadsheet, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ReportSummary = {
    id: number;
    student_name: string;
    student_id: string;
    class_name: string;
    section: string;
    roll_no: number;
    exam_name: string;
    academic_year: string;
    total_marks: number;
    gpa: number;
    grade: string;
    status: string;
    failed_subjects_count: number;
};

type ReportsIndexProps = {
    reports: ReportSummary[];
    filters: {
        search?: string;
    };
};

export default function ReportsIndex({ reports, filters }: ReportsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/reports', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, studentName: string) => {
        if (confirm(`Are you sure you want to delete the academic report for ${studentName}?`)) {
            router.delete(`/reports/${id}`);
        }
    };

    return (
        <>
            <Head title="Academic Reports" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Academic Reports</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage and generate student progress reports, marks sheets, and print layouts.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/reports/create">
                            <Plus className="mr-2 size-4" /> Create Report
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by student name, Admission No, class, exam, or year..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters.search && (
                        <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/reports'); }}>
                            Clear
                        </Button>
                    )}
                </form>

                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Student</th>
                                    <th className="px-4 py-3 font-medium">Class / Section</th>
                                    <th className="px-4 py-3 font-medium">Exam & Year</th>
                                    <th className="px-4 py-3 font-medium text-center">Total Marks</th>
                                    <th className="px-4 py-3 font-medium text-center">GPA</th>
                                    <th className="px-4 py-3 font-medium text-center">Grade</th>
                                    <th className="px-4 py-3 font-medium text-center">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                            No academic reports found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="border-t hover:bg-muted/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-foreground">{report.student_name}</p>
                                                <p className="text-xs text-muted-foreground">ID: {report.student_id}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                <p>{report.class_name} ({report.section})</p>
                                                <p className="text-xs text-muted-foreground">Roll: {report.roll_no}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                <p>{report.exam_name}</p>
                                                <p className="text-xs text-muted-foreground">{report.academic_year}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-foreground">
                                                {report.total_marks}
                                            </td>
                                            <td className="px-4 py-3 text-center text-foreground font-medium">
                                                {report.gpa.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant={report.grade === 'F' ? 'destructive' : 'secondary'} className="font-semibold px-2 py-0.5">
                                                    {report.grade}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge
                                                    variant={report.status === 'Passed' ? 'default' : 'destructive'}
                                                    className="font-medium"
                                                >
                                                    {report.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/reports/${report.id}`} title="View Progress Report">
                                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/reports/${report.id}/edit`} title="Edit Report">
                                                            <Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="size-8"
                                                        onClick={() => handleDelete(report.id, report.student_name)}
                                                        title="Delete Report"
                                                    >
                                                        <Trash2 className="size-3.5 text-red-600 dark:text-red-400" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [{ title: 'Reports', href: '/reports' }],
};
