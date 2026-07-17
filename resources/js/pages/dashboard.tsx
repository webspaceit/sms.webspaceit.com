import { Head } from '@inertiajs/react';
import { Banknote, CalendarCheck, GraduationCap, School, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';

type Stat = {
    label: string;
    value: string;
    note: string;
};

type Student = {
    id: number;
    student_id: string;
    name: string;
    class_name: string;
    section: string;
    roll_no: number;
    district: string;
};

type FeeSummary = {
    status: string;
    total: number;
    amount: number;
};

type SchoolInfo = {
    name: string;
    address: string;
    footer: string;
    footer_url: string;
};

const icons = [GraduationCap, UsersRound, CalendarCheck, Banknote];

const statusConfig: Record<string, { variant: 'default' | 'secondary'; dot: string }> = {
    paid: { variant: 'default', dot: 'bg-emerald-500' },
    pending: { variant: 'secondary', dot: 'bg-amber-400' },
    overdue: { variant: 'secondary', dot: 'bg-red-500' },
};

export default function Dashboard({
    school,
    stats,
    recentStudents,
    feeSummary,
}: {
    school: SchoolInfo;
    stats: Stat[];
    recentStudents: Student[];
    feeSummary: FeeSummary[];
}) {
    return (
        <>
            <Head title="Dashboard" />

            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <section className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-500">Bangladesh School Management</p>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Academic Operations Dashboard</h1>
                </section>

                {/* School Info */}
                <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                            <School className="size-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{school.name}</h2>
                            <p className="text-sm text-gray-500">{school.address}</p>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = icons[index] ?? GraduationCap;

                        return (
                            <article
                                key={stat.label}
                                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                        <Icon className="size-5 text-emerald-600" />
                                    </div>
                                </div>
                                <p className="mt-3 text-3xl font-bold text-emerald-600">{stat.value}</p>
                                <p className="mt-1 text-sm text-gray-400">{stat.note}</p>
                            </article>
                        );
                    })}
                </section>

                {/* Recent Students + Fee Position */}
                <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <article className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                        <div className="border-b border-gray-100 p-4">
                            <h2 className="font-semibold text-gray-900">Recent Students</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <th className="px-4 py-3 font-medium">Student</th>
                                        <th className="px-4 py-3 font-medium">Class</th>
                                        <th className="px-4 py-3 font-medium">Roll</th>
                                        <th className="px-4 py-3 font-medium">District</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentStudents.map((student) => (
                                        <tr key={student.id} className="border-b border-gray-50 last:border-0">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-xs text-gray-400">{student.student_id}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{student.class_name} {student.section}</td>
                                            <td className="px-4 py-3 text-gray-600">{student.roll_no}</td>
                                            <td className="px-4 py-3 text-gray-600">{student.district}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>

                    <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                        <h2 className="font-semibold text-gray-900">Monthly Fee Position</h2>
                        <div className="mt-4 space-y-3">
                            {feeSummary.map((item) => {
                                const cfg = statusConfig[item.status] ?? { variant: 'secondary' as const, dot: 'bg-gray-400' };

                                return (
                                    <div key={item.status} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`size-2.5 rounded-full ${cfg.dot}`} />
                                            <div>
                                                <Badge variant={cfg.variant}>{item.status}</Badge>
                                                <p className="mt-1 text-sm text-gray-400">{item.total} invoices</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900">BDT {Number(item.amount).toLocaleString()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </article>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
