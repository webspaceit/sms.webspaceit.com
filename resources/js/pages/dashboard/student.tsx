import { Head, Link } from '@inertiajs/react';
import { BookOpen, CalendarCheck, CreditCard, FileText, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Fee = {
    id: number;
    invoice_no: string;
    amount: number;
    status: string;
    fee_head: string | null;
    month: string | null;
    paid_on: string | null;
    due_date: string | null;
};

type Props = {
    schoolName: string;
    student: { id: number; name: string; student_id: string; class_name: string; section: string; roll_no: number } | null;
    reports: { id: number; exam_name: string; academic_year: string }[];
    studyMaterials: { id: number; title: string; subject: { name: string } | null }[];
    fees: Fee[];
    attendance: { id: number; date: string; status: string }[];
    notices: { id: number; title: string; created_at: string }[];
};

export default function StudentDashboard({ schoolName, student, reports, studyMaterials, fees, attendance, notices }: Props) {
    if (!student) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <h2 className="text-xl font-semibold">Welcome to {schoolName}</h2>
                <p className="text-muted-foreground">Student profile not linked to your account. Please contact the administration.</p>
            </main>
        );
    }

    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const totalPaid = fees.filter((f) => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
    const totalDue = fees.filter((f) => f.status === 'due' || f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);
    const recentFees = fees.slice(0, 5);

    return (
        <>
            <Head title="Student Dashboard" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <GraduationCap className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {student.name}</h1>
                        <p className="text-sm text-muted-foreground">{student.class_name} - {student.section} | Roll: {student.roll_no} | ID: {student.student_id}</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Attendance</p>
                            <CalendarCheck className="size-5 text-emerald-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{presentCount}/{attendance.length}</p>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Reports</p>
                            <FileText className="size-5 text-blue-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{reports.length}</p>
                        <p className="text-xs text-muted-foreground">Academic reports</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Study Materials</p>
                            <BookOpen className="size-5 text-indigo-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{studyMaterials.length}</p>
                        <p className="text-xs text-muted-foreground">Available resources</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Fees Paid</p>
                            <CreditCard className="size-5 text-amber-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">BDT {totalPaid.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{totalDue > 0 ? `BDT ${totalDue.toLocaleString()} due` : 'All clear'}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card shadow-sm">
                        <div className="border-b px-5 py-3">
                            <h2 className="font-semibold">Recent Reports</h2>
                        </div>
                        <div className="p-4">
                            {reports.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No reports available yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {reports.slice(0, 5).map((r) => (
                                        <li key={r.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                            <span className="font-medium">{r.exam_name}</span>
                                            <span className="text-muted-foreground">{r.academic_year}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card shadow-sm">
                        <div className="border-b px-5 py-3">
                            <h2 className="font-semibold">Latest Notices</h2>
                        </div>
                        <div className="p-4">
                            {notices.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No notices yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {notices.slice(0, 5).map((n) => (
                                        <li key={n.id} className="rounded-md border p-3 text-sm">
                                            <p className="font-medium">{n.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b px-5 py-3">
                        <h2 className="font-semibold">Recent Fee Collections</h2>
                    </div>
                    <div className="p-4">
                        {fees.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No fee records available.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/60 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2 font-medium">Invoice</th>
                                            <th className="px-3 py-2 font-medium">Fee Head</th>
                                            <th className="px-3 py-2 font-medium">Month</th>
                                            <th className="px-3 py-2 font-medium">Amount</th>
                                            <th className="px-3 py-2 font-medium">Status</th>
                                            <th className="px-3 py-2 font-medium">Paid On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentFees.map((f) => (
                                            <tr key={f.id} className="border-t">
                                                <td className="px-3 py-2 font-mono text-xs">{f.invoice_no}</td>
                                                <td className="px-3 py-2">{f.fee_head || '-'}</td>
                                                <td className="px-3 py-2">{f.month || '-'}</td>
                                                <td className="px-3 py-2">BDT {Number(f.amount).toLocaleString()}</td>
                                                <td className="px-3 py-2">
                                                    <Badge variant={f.status === 'paid' ? 'secondary' : f.status === 'due' ? 'destructive' : 'outline'}>
                                                        {f.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-2">{f.paid_on || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {fees.length > 5 && (
                            <p className="mt-3 text-xs text-muted-foreground">Showing 5 of {fees.length} records</p>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b px-5 py-3 flex items-center justify-between">
                        <h2 className="font-semibold">Study Materials</h2>
                        <Button variant="outline" size="sm" asChild><Link href="/study-materials">View All</Link></Button>
                    </div>
                    <div className="p-4">
                        {studyMaterials.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No study materials available.</p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {studyMaterials.map((m) => (
                                    <div key={m.id} className="rounded-md border p-3 text-sm">
                                        <p className="font-medium truncate">{m.title}</p>
                                        {m.subject && <p className="text-xs text-muted-foreground">{m.subject.name}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}