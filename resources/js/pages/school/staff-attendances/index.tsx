import { Head, router, useForm } from '@inertiajs/react';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type StaffAtt = {
    user_id: number;
    name: string;
    role: string;
    email: string;
    status: string;
    attendance_id: number | null;
    remarks: string | null;
};

type Props = {
    attendances: StaffAtt[];
    date: string;
};

export default function Index({ attendances, date }: Props) {
    const { data, setData, post, processing } = useForm({
        date: date,
        attendances: attendances.map((a) => ({ user_id: a.user_id, status: a.status, remarks: a.remarks ?? '' })),
    });

    const handleDateChange = (newDate: string) => {
        router.get('/staff-attendances', { date: newDate }, { preserveState: true });
    };

    const updateStatus = (userId: number, status: string) => {
        setData('attendances', data.attendances.map((a) =>
            a.user_id === userId ? { ...a, status } : a
        ));
    };

    const updateRemarks = (userId: number, remarks: string) => {
        setData('attendances', data.attendances.map((a) =>
            a.user_id === userId ? { ...a, remarks } : a
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/staff-attendances', { preserveState: true });
    };

    const statusColor = (s: string) => {
        switch (s) {
            case 'present': return 'bg-emerald-600 text-white hover:bg-emerald-700';
            case 'absent': return 'bg-red-600 text-white hover:bg-red-700';
            case 'late': return 'bg-yellow-500 text-white hover:bg-yellow-600';
            case 'half_day': return 'bg-orange-500 text-white hover:bg-orange-600';
            default: return '';
        }
    };

    const roleColor: Record<string, string> = {
        superadmin: 'bg-purple-100 text-purple-800',
        admin: 'bg-red-100 text-red-800',
        teacher: 'bg-blue-100 text-blue-800',
        accountant: 'bg-green-100 text-green-800',
        receptionist: 'bg-yellow-100 text-yellow-800',
        librarian: 'bg-indigo-100 text-indigo-800',
    };

    return (
        <>
            <Head title="Staff Attendance" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <UserCheck className="size-6 text-emerald-600" /> Staff Attendance
                    </h1>
                    <p className="text-sm text-muted-foreground">Mark attendance for non-teaching staff and teachers.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-end gap-3">
                        <div className="space-y-1">
                            <Label>Date</Label>
                            <Input type="date" value={data.date} onChange={(e) => handleDateChange(e.target.value)} className="w-48" />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendances.map((a) => (
                                    <TableRow key={a.user_id}>
                                        <TableCell>
                                            <p className="font-medium">{a.name}</p>
                                            <p className="text-xs text-muted-foreground">{a.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleColor[a.role] ?? ''}`}>
                                                {a.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {['present', 'absent', 'late', 'half_day'].map((s) => (
                                                    <Button
                                                        key={s}
                                                        type="button"
                                                        size="sm"
                                                        className={data.attendances.find((att) => att.user_id === a.user_id)?.status === s ? statusColor(s) : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                                        onClick={() => updateStatus(a.user_id, s)}
                                                    >
                                                        {s === 'half_day' ? 'Half' : s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </Button>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={data.attendances.find((att) => att.user_id === a.user_id)?.remarks ?? ''}
                                                onChange={(e) => updateRemarks(a.user_id, e.target.value)}
                                                placeholder="Remarks..."
                                                className="w-36 h-8 text-xs"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>Save Attendance</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Staff Attendance', href: '/staff-attendances' }] };
