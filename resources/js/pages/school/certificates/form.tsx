import { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type Certificate = { id: number; student_id: number; type: string; certificate_no: string; issue_date: string; content: string; remarks: string | null };
type Props = { certificate?: Certificate; classes: { id: number; name: string }[]; students: { id: number; name: string; class_id: number }[]; isEdit: boolean };

const certTypes = ['Transfer Certificate', 'Character Certificate', 'Bonafide Certificate', 'Scholarship Certificate', 'Other'];

export default function Form({ certificate, classes, students, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        student_id: certificate?.student_id?.toString() ?? '',
        type: certificate?.type ?? '',
        certificate_no: certificate?.certificate_no ?? '',
        issue_date: certificate?.issue_date ?? '',
        content: certificate?.content ?? '',
        remarks: certificate?.remarks ?? '',
    });

    const selectedStudent = useMemo(() => students.find((s) => s.id.toString() === data.student_id), [students, data.student_id]);
    const selectedClassId = selectedStudent?.class_id ? selectedStudent.class_id.toString() : '';

    const filteredStudents = useMemo(
        () => students.filter((s) => s.class_id && s.class_id.toString() === selectedClassId),
        [students, selectedClassId],
    );

    const classOptions = classes.map((c) => ({ value: c.id.toString(), label: c.name }));
    const studentOptions = filteredStudents.map((s) => ({ value: s.id.toString(), label: s.name }));

    const handleClassChange = (val: string) => {
        const firstStudent = students.filter((s) => s.class_id && s.class_id.toString() === val)[0];
        setData('student_id', firstStudent?.id.toString() ?? '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && certificate) put(`/certificates/${certificate.id}`);
        else post('/certificates');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Certificate' : 'Issue Certificate'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/certificates"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Certificate' : 'Issue Certificate'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update certificate.' : 'Issue a new certificate.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class</Label>
                            <SearchableSelect options={classOptions} value={selectedClassId} onChange={handleClassChange} placeholder="Select class..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student_id">Student</Label>
                            <SearchableSelect options={studentOptions} value={data.student_id} onChange={(val) => setData('student_id', val)} placeholder="Select student..." disabled={!selectedClassId} />
                            {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                required
                            >
                                <option value="">Select type...</option>
                                {certTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>
                        <div className="space-y-2"><Label htmlFor="certificate_no">Certificate No</Label><Input id="certificate_no" value={data.certificate_no} onChange={(e) => setData('certificate_no', e.target.value)} placeholder="e.g. CERT-001" required />{errors.certificate_no && <p className="text-sm text-red-500">{errors.certificate_no}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="issue_date">Issue Date</Label><Input id="issue_date" type="date" value={data.issue_date} onChange={(e) => setData('issue_date', e.target.value)} required />{errors.issue_date && <p className="text-sm text-red-500">{errors.issue_date}</p>}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea id="content" value={data.content} onChange={(e) => setData('content', e.target.value)} className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Certificate content..." required />
                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                    </div>
                    <div className="space-y-2"><Label htmlFor="remarks">Remarks</Label><Input id="remarks" value={data.remarks} onChange={(e) => setData('remarks', e.target.value)} placeholder="Optional remarks..." />{errors.remarks && <p className="text-sm text-red-500">{errors.remarks}</p>}</div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/certificates">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Certificates', href: '/certificates' }, { title: 'Manage', href: '' }] };
