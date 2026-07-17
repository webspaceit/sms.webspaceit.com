import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SalaryStructure = { id: number; teacher_id: number; basic_salary: number; house_rent: number; medical: number; transport_allowance: number; other_allowances: number; deductions: number; notes: string | null; effective_from: string };
type Props = { salaryStructure?: SalaryStructure; teachers: { id: number; name: string }[]; isEdit: boolean };

export default function Form({ salaryStructure, teachers, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        teacher_id: salaryStructure?.teacher_id?.toString() ?? '',
        basic_salary: salaryStructure?.basic_salary?.toString() ?? '',
        house_rent: salaryStructure?.house_rent?.toString() ?? '',
        medical: salaryStructure?.medical?.toString() ?? '',
        transport_allowance: salaryStructure?.transport_allowance?.toString() ?? '',
        other_allowances: salaryStructure?.other_allowances?.toString() ?? '',
        deductions: salaryStructure?.deductions?.toString() ?? '',
        notes: salaryStructure?.notes ?? '',
        effective_from: salaryStructure?.effective_from ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && salaryStructure) put(`/salary-structures/${salaryStructure.id}`);
        else post('/salary-structures');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Structure' : 'Create Structure'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/salary-structures"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Salary Structure' : 'Create Salary Structure'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update salary structure.' : 'Define a new salary structure.'}</p></div>
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
                        <div className="space-y-2"><Label htmlFor="basic_salary">Basic Salary</Label><Input id="basic_salary" type="number" value={data.basic_salary} onChange={(e) => setData('basic_salary', e.target.value)} required />{errors.basic_salary && <p className="text-sm text-red-500">{errors.basic_salary}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="house_rent">House Rent</Label><Input id="house_rent" type="number" value={data.house_rent} onChange={(e) => setData('house_rent', e.target.value)} />{errors.house_rent && <p className="text-sm text-red-500">{errors.house_rent}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="medical">Medical</Label><Input id="medical" type="number" value={data.medical} onChange={(e) => setData('medical', e.target.value)} />{errors.medical && <p className="text-sm text-red-500">{errors.medical}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="transport_allowance">Transport Allowance</Label><Input id="transport_allowance" type="number" value={data.transport_allowance} onChange={(e) => setData('transport_allowance', e.target.value)} />{errors.transport_allowance && <p className="text-sm text-red-500">{errors.transport_allowance}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="other_allowances">Other Allowances</Label><Input id="other_allowances" type="number" value={data.other_allowances} onChange={(e) => setData('other_allowances', e.target.value)} />{errors.other_allowances && <p className="text-sm text-red-500">{errors.other_allowances}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="deductions">Deductions</Label><Input id="deductions" type="number" value={data.deductions} onChange={(e) => setData('deductions', e.target.value)} />{errors.deductions && <p className="text-sm text-red-500">{errors.deductions}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="effective_from">Effective From</Label><Input id="effective_from" type="date" value={data.effective_from} onChange={(e) => setData('effective_from', e.target.value)} required />{errors.effective_from && <p className="text-sm text-red-500">{errors.effective_from}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Input id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Optional notes..." />{errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}</div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/salary-structures">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Salary Structures', href: '/salary-structures' }, { title: 'Manage', href: '' }] };
