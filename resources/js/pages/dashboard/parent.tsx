import { Head } from '@inertiajs/react';
import { GraduationCap, Heart, Bell, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Fee = {
    id: number;
    invoice_no: string;
    amount: number;
    status: string;
    fee_head: string | null;
    month: string | null;
    paid_on: string | null;
};

type Child = {
    id: number;
    name: string;
    student_id: string;
    class_name: string;
    section: string;
    roll_no: number;
};

type Props = {
    schoolName: string;
    children: Child[];
    feesByChild: Record<string, Fee[]>;
    notices: { id: number; title: string; created_at: string }[];
};

export default function ParentDashboard({ schoolName, children, feesByChild, notices }: Props) {
    return (
        <>
            <Head title="Parent Dashboard" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                        <Heart className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
                        <p className="text-sm text-muted-foreground">{schoolName}</p>
                    </div>
                </div>

                {children.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
                        <GraduationCap className="mx-auto size-12 mb-3 opacity-40" />
                        <p className="text-lg font-medium">No children linked</p>
                        <p className="text-sm">Please contact the school to link your children to this account.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {children.map((child) => {
                            const childFees = feesByChild[child.id] || [];
                            const totalPaid = childFees.filter((f) => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
                            const totalDue = childFees.filter((f) => f.status === 'due' || f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);
                            return (
                                <div key={child.id} className="rounded-lg border bg-card p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                            <GraduationCap className="size-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{child.name}</h3>
                                            <p className="text-sm text-muted-foreground">{child.class_name} - {child.section} | Roll: {child.roll_no}</p>
                                            <p className="text-xs text-muted-foreground">ID: {child.student_id}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-sm border-t pt-3">
                                        <div className="flex items-center gap-1">
                                            <CreditCard className="size-4 text-green-600" />
                                            <span>Paid: <strong>BDT {totalPaid.toLocaleString()}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CreditCard className="size-4 text-red-600" />
                                            <span>Due: <strong>{totalDue > 0 ? `BDT ${totalDue.toLocaleString()}` : 'Nil'}</strong></span>
                                        </div>
                                    </div>
                                    {childFees.length > 0 && (
                                        <div className="overflow-x-auto mt-3">
                                            <table className="w-full text-xs">
                                                <thead className="bg-muted/60 text-left text-muted-foreground">
                                                    <tr>
                                                        <th className="px-2 py-1 font-medium">Invoice</th>
                                                        <th className="px-2 py-1 font-medium">Head</th>
                                                        <th className="px-2 py-1 font-medium">Amount</th>
                                                        <th className="px-2 py-1 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {childFees.slice(0, 3).map((f) => (
                                                        <tr key={f.id} className="border-t">
                                                            <td className="px-2 py-1 font-mono">{f.invoice_no}</td>
                                                            <td className="px-2 py-1">{f.fee_head || '-'}</td>
                                                            <td className="px-2 py-1">BDT {Number(f.amount).toLocaleString()}</td>
                                                            <td className="px-2 py-1">
                                                                <Badge variant={f.status === 'paid' ? 'secondary' : f.status === 'due' ? 'destructive' : 'outline'} className="text-[10px] px-1.5 py-0">
                                                                    {f.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {childFees.length > 3 && (
                                                <p className="mt-1 text-[10px] text-muted-foreground">+{childFees.length - 3} more records</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b px-5 py-3 flex items-center gap-2">
                        <Bell className="size-4 text-amber-600" />
                        <h2 className="font-semibold">School Notices</h2>
                    </div>
                    <div className="p-4">
                        {notices.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No notices published.</p>
                        ) : (
                            <ul className="space-y-2">
                                {notices.map((n) => (
                                    <li key={n.id} className="rounded-md border p-3 text-sm flex items-start justify-between">
                                        <span className="font-medium">{n.title}</span>
                                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{new Date(n.created_at).toLocaleDateString()}</span>
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