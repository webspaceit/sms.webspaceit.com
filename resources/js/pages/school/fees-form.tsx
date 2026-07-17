import { useCallback, useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

type Student = { id: number; name: string; class_name: string; roll_no: number; class_id: number; section_id: number | null };
type FeeHead = { id: number; name: string };
type Cls = { id: number; name: string };
type Sec = { id: number; name: string; class_id: number };

type FeeRecord = {
    id: number;
    student_id: number;
    fee_head_id?: number;
    invoice_no: string;
    month: string;
    amount: number;
    status: string;
    due_date: string;
    paid_on: string;
    payment_method: string;
    remarks?: string;
};

type FeesFormProps = {
    fee?: FeeRecord;
    classes: Cls[];
    students: Student[];
    allSections: Sec[];
    feeHeads: FeeHead[];
    isEdit: boolean;
    selectedStudentId?: string | null;
    nextInvoiceNo?: string;
    preselectedStudent?: Record<string, unknown> | null;
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const statuses = ['paid', 'due', 'partial', 'waived'];
const paymentMethods = ['Cash', 'bKash', 'Nagad', 'Bank Transfer', 'Rocket', 'Upay'];

export default function FeesForm({ fee, classes, students, allSections, feeHeads, isEdit, selectedStudentId, nextInvoiceNo }: FeesFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        student_id: fee?.student_id?.toString() ?? selectedStudentId ?? '',
        fee_head_id: fee?.fee_head_id?.toString() ?? '',
        invoice_no: fee?.invoice_no ?? nextInvoiceNo ?? '',
        month: fee?.month ?? '',
        amount: fee?.amount?.toString() ?? '',
        status: fee?.status ?? 'due',
        due_date: fee?.due_date ?? '',
        paid_on: fee?.paid_on ?? '',
        payment_method: fee?.payment_method ?? '',
        remarks: fee?.remarks ?? '',
    });

    const selectedStudent = useMemo(() => students.find((s) => s.id.toString() === data.student_id), [students, data.student_id]);

    const initialClassId = selectedStudent?.class_id ? selectedStudent.class_id.toString() : '';
    const initialSectionId = selectedStudent?.section_id ? selectedStudent.section_id.toString() : '';
    const [selectedClassId, setSelectedClassId] = useState(initialClassId);
    const [selectedSectionId, setSelectedSectionId] = useState(initialSectionId);

    const filteredStudents = useMemo(
        () => students.filter((s) => {
            if (selectedClassId && (!s.class_id || s.class_id.toString() !== selectedClassId)) return false;
            if (selectedSectionId && (!s.section_id || s.section_id.toString() !== selectedSectionId)) return false;
            return true;
        }),
        [students, selectedClassId, selectedSectionId],
    );

    const filteredSections = useMemo(
        () => allSections.filter((s) => String(s.class_id) === selectedClassId),
        [allSections, selectedClassId],
    );

    const classOptions = useMemo(() => classes.map((c) => ({ value: c.id.toString(), label: c.name })), [classes]);
    const sectionOptions = useMemo(() => filteredSections.map((s) => ({ value: s.id.toString(), label: s.name })), [filteredSections]);
    const studentOptions = useMemo(() => filteredStudents.map((s) => ({ value: s.id.toString(), label: `${s.name} (${s.class_name} · Roll ${s.roll_no})` })), [filteredStudents]);

    const handleClassChange = useCallback((val: string) => {
        setSelectedClassId(val);
        setSelectedSectionId('');
        setData('student_id', '');
    }, []);

    const handleSectionChange = useCallback((val: string) => {
        setSelectedSectionId(val);
        setData('student_id', '');
    }, []);

    const handleStudentChange = useCallback((val: string) => {
        setData('student_id', val);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            student_id: Number(data.student_id),
            fee_head_id: data.fee_head_id ? Number(data.fee_head_id) : null,
            amount: Number(data.amount),
            paid_on: data.paid_on || null,
            payment_method: data.payment_method || null,
            remarks: data.remarks || null,
        };
        if (isEdit && fee) {
            put(`/fees/${fee.id}`);
        } else {
            post('/fees');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Fee Record' : 'Collect Fee'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/fees">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Fee Record' : 'Collect Fee'}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? 'Update fee collection record.' : 'Record a new fee payment or invoice.'}
                        </p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class</Label>
                            {isEdit && fee ? (
                                <Input disabled value={selectedStudent?.class_name ?? ''} className="bg-muted" />
                            ) : (
                                <SearchableSelect
                                    options={classOptions}
                                    value={selectedClassId}
                                    onChange={handleClassChange}
                                    placeholder="Select class..."
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section_id">Section</Label>
                            {isEdit && fee ? (
                                <Input disabled value={allSections.find((s) => String(s.id) === selectedSectionId)?.name ?? ''} className="bg-muted" />
                            ) : (
                                <SearchableSelect
                                    options={sectionOptions}
                                    value={selectedSectionId}
                                    onChange={handleSectionChange}
                                    placeholder={selectedClassId ? 'Select section...' : 'Select class first...'}
                                    disabled={!selectedClassId}
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student_id">
                                Student <span className="text-red-500">*</span>
                            </Label>
                            {isEdit && fee ? (
                                <Input disabled value={selectedStudent?.name ?? ''} className="bg-muted" />
                            ) : (
                                <SearchableSelect
                                    options={studentOptions}
                                    value={data.student_id}
                                    onChange={handleStudentChange}
                                    placeholder={selectedClassId ? 'Search for a student...' : 'Select class first...'}
                                    disabled={!selectedClassId}
                                />
                            )}
                            {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fee_head_id">Fee Head</Label>
                            <Select value={data.fee_head_id} onValueChange={(val) => setData('fee_head_id', val)}>
                                <SelectTrigger id="fee_head_id">
                                    <SelectValue placeholder="Select fee type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {feeHeads.map((fh) => (
                                        <SelectItem key={fh.id} value={fh.id.toString()}>{fh.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.fee_head_id && <p className="text-sm text-red-500">{errors.fee_head_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invoice_no">Invoice No</Label>
                            <Input
                                id="invoice_no"
                                value={data.invoice_no}
                                readOnly
                                className="bg-muted cursor-default"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="month">Month</Label>
                            <Select value={data.month} onValueChange={(val) => setData('month', val)}>
                                <SelectTrigger id="month">
                                    <SelectValue placeholder="Select month..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m) => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (BDT)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="e.g. 1500"
                                required
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                required
                            />
                            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paid_on">Paid On (if paid)</Label>
                            <Input
                                id="paid_on"
                                type="date"
                                value={data.paid_on}
                                onChange={(e) => setData('paid_on', e.target.value)}
                            />
                            {errors.paid_on && <p className="text-sm text-red-500">{errors.paid_on}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Select value={data.payment_method} onValueChange={(val) => setData('payment_method', val)}>
                                <SelectTrigger id="payment_method">
                                    <SelectValue placeholder="Select method..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map((pm) => (
                                        <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="remarks">Remarks (optional)</Label>
                        <Input
                            id="remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="Any notes or remarks..."
                        />
                        {errors.remarks && <p className="text-sm text-red-500">{errors.remarks}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/fees">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update Fee' : 'Save Fee'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

FeesForm.layout = {
    breadcrumbs: [
        { title: 'Fees', href: '/fees' },
        { title: 'Manage', href: '' },
    ],
};
