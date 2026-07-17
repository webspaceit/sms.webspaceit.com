import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SalaryPayment = { id: number; teacher_id: number; month: number; year: number; gross_salary: number; deductions: number; net_pay: number; paid_date: string; payment_method: string; reference_no: string | null; notes: string | null };
type Props = { payment?: SalaryPayment; teachers: { id: number; name: string }[]; isEdit: boolean };

const paymentMethods = ['Cash', 'bKash', 'Nagad', 'Bank Transfer', 'Cheque', 'Rocket'];

export default function Form({ payment, teachers, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        teacher_id: payment?.teacher_id?.toString() ?? '',
        month: payment?.month?.toString() ?? '',
        year: payment?.year?.toString() ?? '',
        gross_salary: payment?.gross_salary?.toString() ?? '',
        deductions: payment?.deductions?.toString() ?? '',
        net_pay: payment?.net_pay?.toString() ?? '',
        paid_date: payment?.paid_date ?? '',
        payment_method: payment?.payment_method ?? '',
        reference_no: payment?.reference_no ?? '',
        notes: payment?.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && payment) put(`/salary-payments/${payment.id}`);
        else post('/salary-payments');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Payment' : 'Record Payment'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/salary-payments"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Payment' : 'Record Salary Payment'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update payment record.' : 'Record a salary payment to a teacher.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="teacher_id">Teacher</Label>
                        <Select value={data.teacher_id} onValueChange={(val) => setData('teacher_id', val)}>
                            <SelectTrigger id="teacher_id"><SelectValue placeholder="Select teacher..." /></SelectTrigger>
                            <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="month">Month</Label><Input id="month" type="number" min={1} max={12} value={data.month} onChange={(e) => setData('month', e.target.value)} placeholder="1-12" required />{errors.month && <p className="text-sm text-red-500">{errors.month}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="year">Year</Label><Input id="year" type="number" value={data.year} onChange={(e) => setData('year', e.target.value)} placeholder="e.g. 2026" required />{errors.year && <p className="text-sm text-red-500">{errors.year}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="paid_date">Paid Date</Label><Input id="paid_date" type="date" value={data.paid_date} onChange={(e) => setData('paid_date', e.target.value)} required />{errors.paid_date && <p className="text-sm text-red-500">{errors.paid_date}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="gross_salary">Gross Salary</Label><Input id="gross_salary" type="number" value={data.gross_salary} onChange={(e) => setData('gross_salary', e.target.value)} required />{errors.gross_salary && <p className="text-sm text-red-500">{errors.gross_salary}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="deductions">Deductions</Label><Input id="deductions" type="number" value={data.deductions} onChange={(e) => setData('deductions', e.target.value)} />{errors.deductions && <p className="text-sm text-red-500">{errors.deductions}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="net_pay">Net Pay</Label><Input id="net_pay" type="number" value={data.net_pay} onChange={(e) => setData('net_pay', e.target.value)} required />{errors.net_pay && <p className="text-sm text-red-500">{errors.net_pay}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Select value={data.payment_method} onValueChange={(val) => setData('payment_method', val)}>
                                <SelectTrigger id="payment_method"><SelectValue placeholder="Select method..." /></SelectTrigger>
                                <SelectContent>{paymentMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method}</p>}
                        </div>
                        <div className="space-y-2"><Label htmlFor="reference_no">Reference No</Label><Input id="reference_no" value={data.reference_no} onChange={(e) => setData('reference_no', e.target.value)} placeholder="e.g. TXN-001" />{errors.reference_no && <p className="text-sm text-red-500">{errors.reference_no}</p>}</div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Input id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Optional notes..." />{errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}</div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/salary-payments">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Salary Payments', href: '/salary-payments' }, { title: 'Manage', href: '' }] };
