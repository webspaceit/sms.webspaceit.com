import { Head, Link } from '@inertiajs/react';
import { BookOpen, CalendarCheck, Clock, FileSpreadsheet, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    schoolName: string;
    teacher: { id: number; name: string; employee_id: string; designation: string | null } | null;
    totalStudents: number;
    todayAttendance: { id: number; status: string } | null;
    myMaterials: { id: number; title: string; created_at: string }[];
    recentReports: { id: number; exam_name: string; student: { name: string } | null }[];
};

export default function TeacherDashboard({ schoolName, teacher, totalStudents, todayAttendance, myMaterials, recentReports }: Props) {
    if (!teacher) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <h2 className="text-xl font-semibold">Welcome to {schoolName}</h2>
                <p className="text-muted-foreground">Teacher profile not linked. Contact administration.</p>
            </main>
        );
    }

    return (
        <>
            <Head title="Teacher Dashboard" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <UsersRound className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {teacher.name}</h1>
                        <p className="text-sm text-muted-foreground">{teacher.designation ?? 'Teacher'} | ID: {teacher.employee_id}</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Students</p>
                            <UsersRound className="size-5 text-blue-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{totalStudents}</p>
                        <p className="text-xs text-muted-foreground">Under your classes</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Today's Attendance</p>
                            <CalendarCheck className="size-5 text-emerald-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{todayAttendance ? todayAttendance.status : 'Not marked'}</p>
                        <p className="text-xs text-muted-foreground">Teacher attendance</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Materials</p>
                            <BookOpen className="size-5 text-indigo-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{myMaterials.length}</p>
                        <p className="text-xs text-muted-foreground">Uploaded by you</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Recent Reports</p>
                            <FileSpreadsheet className="size-5 text-amber-600" />
                        </div>
                        <p className="mt-2 text-2xl font-bold">{recentReports.length}</p>
                        <p className="text-xs text-muted-foreground">Latest entries</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card shadow-sm">
                        <div className="border-b px-5 py-3 flex items-center justify-between">
                            <h2 className="font-semibold">Quick Actions</h2>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/attendance"><CalendarCheck className="mr-2 size-4" /> Mark Attendance</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/reports/create"><FileSpreadsheet className="mr-2 size-4" /> Add Report</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/study-materials/create"><BookOpen className="mr-2 size-4" /> Upload Material</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link href="/class-routines"><Clock className="mr-2 size-4" /> Class Routine</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card shadow-sm">
                        <div className="border-b px-5 py-3">
                            <h2 className="font-semibold">Recent Reports</h2>
                        </div>
                        <div className="p-4">
                            {recentReports.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No reports yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {recentReports.map((r) => (
                                        <li key={r.id} className="rounded-md border p-3 text-sm flex justify-between">
                                            <span className="font-medium">{r.student?.name ?? 'Unknown'}</span>
                                            <span className="text-muted-foreground">{r.exam_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b px-5 py-3">
                        <h2 className="font-semibold">My Uploaded Materials</h2>
                    </div>
                    <div className="p-4">
                        {myMaterials.length === 0 ? (
                            <p className="text-sm text-muted-foreground">You haven't uploaded any materials yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {myMaterials.map((m) => (
                                    <li key={m.id} className="rounded-md border p-3 text-sm flex justify-between">
                                        <span className="font-medium">{m.title}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
