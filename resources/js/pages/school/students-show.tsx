import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Printer, DollarSign, Search, UserX, MoreVertical, QrCode } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/students' },
    { title: 'Details', href: '' },
];

type SchoolClass = { id: number; name: string };
type SchoolSection = { id: number; name: string };
type AcademicYear = { id: number; name: string };
type Guardian = { id: number; name: string; phone: string; relation: string; occupation: string | null; address: string | null; email: string | null };
type Document = { id: number; type: string; original_name: string; path: string; size: number; mime_type: string };
type FeeCollection = { id: number; fee_head: { id: number; name: string } | null; amount: string; status: string; due_date: string; paid_on: string | null; payment_method: string | null; month: string | null };
type Attendance = { id: number; date: string; status: string };
type HostelAllocation = { id: number; start_date: string; end_date: string | null; is_active: boolean; hostel_room: { id: number; room_no: string; type: string } | null };
type ReportMark = { id: number; subject_name: string; full_marks: number; highest_marks: number | null; total_marks: number; letter_grade: string; grade_point: number; written_marks: number | null; mcq_marks: number | null; practical_marks: number | null; ca_marks: number | null };
type AcademicReport = { id: number; exam_name: string; academic_year: string; class_position: number | null; working_days: number | null; present_days: number | null; absent_days: number | null; moral_evaluation: string | null; co_curricular: string[] | null; comments: string | null; marks: ReportMark[] };

type TimelineEvent = {
    date: string;
    datetime: string;
    type: 'admission' | 'fee' | 'exam' | 'document';
    title: string;
    description: string;
};

type Student = {
    id: number; student_id: string; name: string; name_bn: string | null;
    school_class: SchoolClass | null; section: SchoolSection | null;
    academic_year: AcademicYear | null;
    roll_no: number; date_of_birth: string; gender: string;
    guardian_name: string; guardian_phone: string;
    mother_name: string | null; mother_phone: string | null;
    email: string | null; religion: string | null;
    nationality: string | null; birth_certificate_no: string | null;
    previous_school: string | null; admission_date: string | null;
    district: string; address: string | null;
    blood_group: string | null; status: string;
    photo: string | null;
    guardians: Guardian[];
    documents: Document[];
    fee_collections: FeeCollection[];
    attendances: Attendance[];
    hostel_allocation: HostelAllocation[];
    reports: AcademicReport[];
    student_house: { id: number; name: string } | null;
};

type Sibling = {
    id: number; name: string; student_id: string; roll_no: number;
    gender: string; photo: string | null;
    school_class: SchoolClass | null; section: SchoolSection | null;
};

const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'fee', label: 'Fees' },
    { key: 'exam', label: 'Exam' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'documents', label: 'Documents' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'behaviour', label: 'Student Behaviour' },
];

function InfoRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
    return (
        <tr className="border-b last:border-b-0">
            <td className="py-2.5 px-4 text-sm text-muted-foreground w-[40%]">{label}</td>
            <td className={`py-2.5 px-4 text-sm font-medium ${highlight ? 'text-primary' : ''}`}>{value ?? '-'}</td>
        </tr>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <div className="bg-muted/50 border-b px-4 py-2.5">
                <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            </div>
            <table className="w-full">
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export default function StudentsShow({ student, siblings, timeline = [], currency = 'BDT' }: { student: Student; siblings: Sibling[]; timeline?: TimelineEvent[]; currency?: string }) {
    const [activeTab, setActiveTab] = useState('profile');

    const photoUrl = student.photo
        ? `/storage/${student.photo}`
        : (student.gender === 'Female'
            ? 'https://placehold.co/120x120/e5e7eb/9ca3af?text=F'
            : 'https://placehold.co/120x120/e5e7eb/9ca3af?text=M');

    const siblingPhotoUrl = (s: Sibling) =>
        s.photo ? `/storage/${s.photo}` : 'https://placehold.co/48x48/e5e7eb/9ca3af?text=S';

    return (
        <>
            <Head title={`${student.name} - Student Details`} />
            <main className="flex flex-1 flex-col gap-0 p-4 md:p-6 max-w-[1400px] mx-auto w-full">

                {/* Two-column layout */}
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">

                        {/* Profile card */}
                        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                            {/* Photo + name */}
                            <div className="flex flex-col items-center text-center px-4 pt-5 pb-3">
                                <img
                                    src={photoUrl}
                                    alt={student.name}
                                    className="size-20 rounded-full object-cover border-2 border-muted shadow mb-3"
                                />
                                <h2 className="text-base font-semibold leading-tight">{student.name}</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Admission No <Link href={`/students/${student.id}`} className="text-primary font-medium hover:underline">{student.student_id}</Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Roll Number <span className="text-primary font-medium">{String(student.roll_no).padStart(3, '0')}</span>
                                </p>
                            </div>

                            {/* Action icons row */}
                            <div className="flex border-t divide-x">
                                <Button variant="ghost" size="sm" className="flex-1 rounded-none h-9 gap-1" title="Print" asChild>
                                    <a href={`/students/${student.id}/print`} target="_blank" rel="noopener noreferrer">
                                        <Printer className="size-3.5" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 rounded-none h-9 gap-1" asChild title="Edit">
                                    <Link href={`/students/${student.id}/edit`}><Edit2 className="size-3.5" /></Link>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 rounded-none h-9 gap-1" title="Fees" onClick={() => setActiveTab('fee')}>
                                    <DollarSign className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 rounded-none h-9 gap-1" title="All Students" onClick={() => router.visit('/students')}>
                                    <Search className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 rounded-none h-9 gap-1" title="Disable" onClick={() => {
                                    if (confirm(`Are you sure you want to ${student.status === 'active' ? 'disable' : 'enable'} ${student.name}?`)) {
                                        router.put(`/students/${student.id}/toggle-status`);
                                    }
                                }}>
                                    <UserX className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 rounded-none h-9 gap-1" title="More" onClick={() => {
                                    const el = document.createElement('a');
                                    el.href = `/students/${student.id}`;
                                    el.target = '_blank';
                                    el.click();
                                }}>
                                    <MoreVertical className="size-3.5" />
                                </Button>
                            </div>

                            {/* Key details */}
                            <div className="border-t divide-y text-sm">
                                {[
                                    ['Class', student.school_class?.name ?? '-', true],
                                    ['Section', student.section?.name ?? '-', true],
                                    ['Gender', student.gender, false],
                                ].map(([label, value, hl]) => (
                                    <div key={label as string} className="flex items-center justify-between px-4 py-2">
                                        <span className="text-muted-foreground">{label as string}</span>
                                        <span className={`font-medium text-right ${hl ? 'text-primary' : ''}`}>{value as string}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Barcode placeholder */}
                            <div className="border-t px-4 py-3 flex flex-col items-center gap-2">
                                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                    <span>Barcode</span>
                                </div>
                                <div className="w-full h-10 bg-muted/40 rounded flex items-center justify-center text-xs text-muted-foreground">
                                    ||||||||||||||||||||| {student.student_id}
                                </div>
                                <div className="flex items-center justify-between w-full text-xs text-muted-foreground mt-1">
                                    <span>QR Code</span>
                                </div>
                                <QrCode className="size-12 text-muted-foreground/60" />
                            </div>
                        </div>

                        {/* Siblings */}
                        {siblings.length > 0 && (
                            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                                <div className="px-4 py-2.5 border-b bg-muted/30">
                                    <h3 className="text-sm font-semibold">Sibling</h3>
                                </div>
                                <div className="divide-y">
                                    {siblings.map((s) => (
                                        <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                                            <img
                                                src={siblingPhotoUrl(s)}
                                                alt={s.name}
                                                className="size-12 rounded-full object-cover border border-muted"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/students/${s.id}`} className="text-sm font-medium text-primary hover:underline truncate block">
                                                    {s.name}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">
                                                    Admission No <span className="text-primary">{s.student_id}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Roll Number <span className="text-primary">{s.roll_no}</span>
                                                </p>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-xs text-muted-foreground">Class</span>
                                                    <span className="text-xs text-primary font-medium">{s.school_class?.name ?? '-'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">Section</span>
                                                    <span className="text-xs text-primary font-medium">{s.section?.name ?? '-'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">Gender</span>
                                                    <span className="text-xs text-primary font-medium">{s.gender}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* ── RIGHT MAIN PANEL ── */}
                    <div className="flex-1 min-w-0 rounded-lg border bg-card shadow-sm overflow-hidden">

                        {/* Tab bar */}
                        <div className="border-b bg-background overflow-x-auto">
                            <nav className="flex min-w-max">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab content */}
                        <div className="p-0">

                            {/* ── PROFILE TAB ── */}
                            {activeTab === 'profile' && (
                                <div>
                                    <SectionCard title="">
                                        <InfoRow label="Admission Date" value={student.admission_date} />
                                        <InfoRow label="Date Of Birth" value={student.date_of_birth} />
                                        <InfoRow label="Category" value={null} />
                                        <InfoRow label="Mobile Number" value={student.guardian_phone} />
                                        <InfoRow label="Caste" value={null} />
                                        <InfoRow label="Religion" value={<span className="text-primary">{student.religion}</span>} />
                                        <InfoRow label="Email" value={student.email} />
                                        <InfoRow label="Medical History" value={null} />
                                        <InfoRow label="Note" value={null} />
                                    </SectionCard>

                                    <SectionCard title="Address">
                                        <InfoRow label="Current Address" value={student.address} />
                                        <InfoRow label="Permanent Address" value={student.address} />
                                    </SectionCard>

                                    <SectionCard title="Parent Guardian Detail">
                                        {/* Father info from first guardian or guardian_name field */}
                                        {student.guardians.length > 0 ? (
                                            student.guardians.map((g) => (
                                                <>
                                                    <InfoRow key={`${g.id}-name`} label={`${g.relation ?? 'Guardian'} Name`} value={g.name} />
                                                    <InfoRow key={`${g.id}-phone`} label={`${g.relation ?? 'Guardian'} Phone`} value={g.phone} />
                                                    <InfoRow key={`${g.id}-occ`} label={`${g.relation ?? 'Guardian'} Occupation`} value={g.occupation} />
                                                </>
                                            ))
                                        ) : (
                                            <>
                                                <InfoRow label="Father Name" value={student.guardian_name} />
                                                <InfoRow label="Father Phone" value={student.guardian_phone} />
                                                <InfoRow label="Father Occupation" value={null} />
                                            </>
                                        )}
                                        <InfoRow label="Mother Name" value={student.mother_name} />
                                        <InfoRow label="Mother Phone" value={student.mother_phone} />
                                        <InfoRow label="Mother Occupation" value={null} />
                                        {/* Guardian details */}
                                        {student.guardians.length > 0 && (() => {
                                            const g = student.guardians[0];
                                            return (
                                                <>
                                                    <InfoRow label="Guardian Name" value={g.name} />
                                                    <InfoRow label="Guardian Email" value={g.email} />
                                                    <InfoRow label="Guardian Relation" value={g.relation} />
                                                    <InfoRow label="Guardian Phone" value={g.phone} />
                                                    <InfoRow label="Guardian Occupation" value={g.occupation} />
                                                    <InfoRow label="Guardian Address" value={g.address} />
                                                </>
                                            );
                                        })()}
                                    </SectionCard>

                                    {/* Hostel Details */}
                                    {student.hostel_allocation.length > 0 && (
                                        <SectionCard title="Hostel Details">
                                            {student.hostel_allocation.map((ha) => (
                                                <>
                                                    <InfoRow key={`${ha.id}-hostel`} label="Hostel" value={ha.hostel_room ? `Hostel ${ha.hostel_room.room_no}` : null} />
                                                    <InfoRow key={`${ha.id}-room`} label="Room No." value={ha.hostel_room?.room_no} />
                                                    <InfoRow key={`${ha.id}-type`} label="Room Type" value={ha.hostel_room?.type} />
                                                </>
                                            ))}
                                        </SectionCard>
                                    )}

                                    <SectionCard title="Miscellaneous Details">
                                        <InfoRow label="Blood Group" value={student.blood_group} />
                                        <InfoRow label="House" value={null} />
                                        <InfoRow label="Height" value={null} />
                                        <InfoRow label="Weight" value={null} />
                                        <InfoRow label="Measurement Date" value={null} />
                                        <InfoRow label="Previous School Details" value={student.previous_school ?? 'NO'} />
                                        <InfoRow label="National Identification Number" value={null} />
                                        <InfoRow label="Local Identification Number" value={student.birth_certificate_no} />
                                    </SectionCard>
                                </div>
                            )}

                            {/* ── FEES TAB ── */}
                            {activeTab === 'fee' && (
                                <div className="p-5">
                                    <h3 className="text-sm font-semibold mb-3">Fee Collections</h3>
                                    <div className="overflow-x-auto rounded-lg border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Fee Head</th>
                                                    <th className="px-4 py-3 font-medium">Month</th>
                                                    <th className="px-4 py-3 font-medium">Due Date</th>
                                                    <th className="px-4 py-3 font-medium">Amount ({currency})</th>
                                                    <th className="px-4 py-3 font-medium">Status</th>
                                                    <th className="px-4 py-3 font-medium">Paid On</th>
                                                    <th className="px-4 py-3 font-medium">Method</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {student.fee_collections.length === 0 ? (
                                                    <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No fee records found.</td></tr>
                                                ) : student.fee_collections.map((fc) => (
                                                    <tr key={fc.id} className="border-t hover:bg-muted/40">
                                                        <td className="px-4 py-3">{fc.fee_head?.name ?? '-'}</td>
                                                        <td className="px-4 py-3">{fc.month ?? '-'}</td>
                                                        <td className="px-4 py-3">{fc.due_date}</td>
                                                        <td className="px-4 py-3">{currency} {fc.amount}</td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant={fc.status === 'paid' ? 'default' : 'destructive'}>{fc.status}</Badge>
                                                        </td>
                                                        <td className="px-4 py-3">{fc.paid_on ?? '-'}</td>
                                                        <td className="px-4 py-3">{fc.payment_method ?? '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {student.fee_collections.length > 0 && (
                                        <div className="border-t px-5 py-3 flex justify-end text-sm">
                                            <span className="font-medium">Total Paid: {currency} {student.fee_collections.filter(fc => fc.status === 'paid').reduce((s, fc) => s + Number(fc.amount), 0).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── EXAM TAB ── */}
                            {activeTab === 'exam' && (
                                <div className="p-5 space-y-5">
                                    {student.reports.length === 0 ? (
                                        <div className="rounded-lg border p-8 text-center text-muted-foreground">No exam records found.</div>
                                    ) : student.reports.map((report) => {
                                        const grandTotal = report.marks.reduce((s, m) => s + m.full_marks, 0);
                                        const totalObtained = report.marks.reduce((s, m) => s + m.total_marks, 0);
                                        const percentage = grandTotal > 0 ? ((totalObtained / grandTotal) * 100) : 0;
                                        const hasFail = report.marks.some((m) => m.grade_point === 0);
                                        const division = hasFail ? '-' : percentage >= 60 ? 'First' : percentage >= 40 ? 'Second' : 'Third';
                                        return (
                                            <div key={report.id} className="rounded-lg border overflow-hidden">
                                                <div className="border-b bg-muted/30 px-5 py-3 flex items-center justify-between">
                                                    <h3 className="text-sm font-semibold">{report.exam_name}</h3>
                                                    <span className="text-xs text-muted-foreground">{report.academic_year}</span>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-muted/60 text-left text-muted-foreground">
                                                            <tr>
                                                                <th className="px-4 py-3 font-medium">Subject</th>
                                                                <th className="px-4 py-3 font-medium text-center">Max Marks</th>
                                                                <th className="px-4 py-3 font-medium text-center">Pass Marks</th>
                                                                <th className="px-4 py-3 font-medium text-center">Obtained</th>
                                                                <th className="px-4 py-3 font-medium text-center">Grade</th>
                                                                <th className="px-4 py-3 font-medium text-center">Result</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {report.marks.map((m) => {
                                                                const passMarks = Math.ceil(m.full_marks / 3);
                                                                return (
                                                                    <tr key={m.id} className="border-t hover:bg-muted/40">
                                                                        <td className="px-4 py-3 font-medium">{m.subject_name}</td>
                                                                        <td className="px-4 py-3 text-center">{m.full_marks}</td>
                                                                        <td className="px-4 py-3 text-center text-muted-foreground">{passMarks}</td>
                                                                        <td className="px-4 py-3 text-center font-medium">{m.total_marks}</td>
                                                                        <td className="px-4 py-3 text-center">{m.letter_grade}</td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            {m.grade_point > 0
                                                                                ? <Badge className="bg-emerald-600">Pass</Badge>
                                                                                : <Badge variant="destructive">Fail</Badge>}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="border-t bg-muted/20 px-5 py-3 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                                    <div><span className="text-muted-foreground">Grand Total: </span><span className="font-semibold">{grandTotal}</span></div>
                                                    <div><span className="text-muted-foreground">Obtained: </span><span className="font-semibold">{totalObtained}</span></div>
                                                    <div><span className="text-muted-foreground">Percentage: </span><span className="font-semibold">{percentage.toFixed(2)}%</span></div>
                                                    <div><span className="text-muted-foreground">Rank: </span><span className="font-semibold">{report.class_position ?? '-'}</span></div>
                                                    <div>
                                                        <span className="text-muted-foreground">Result: </span>
                                                        {hasFail ? <Badge variant="destructive" className="text-xs">Fail</Badge> : <Badge className="bg-emerald-600 text-xs">Pass</Badge>}
                                                        {!hasFail && division !== '-' && <span className="ml-1.5 text-muted-foreground text-xs">({division})</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── ATTENDANCE TAB ── */}
                            {activeTab === 'attendance' && (
                                <div className="p-5">
                                    <h3 className="text-sm font-semibold mb-3">Attendance Records</h3>
                                    <div className="overflow-x-auto rounded-lg border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Date</th>
                                                    <th className="px-4 py-3 font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {student.attendances.length === 0 ? (
                                                    <tr><td colSpan={2} className="px-4 py-12 text-center text-muted-foreground">No attendance records found.</td></tr>
                                                ) : student.attendances.map((a) => (
                                                    <tr key={a.id} className="border-t hover:bg-muted/40">
                                                        <td className="px-4 py-3">{a.date}</td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant={a.status === 'present' ? 'default' : a.status === 'absent' ? 'destructive' : 'outline'}>{a.status}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ── DOCUMENTS TAB ── */}
                            {activeTab === 'documents' && (
                                <div className="p-5">
                                    <h3 className="text-sm font-semibold mb-3">Documents</h3>
                                    <div className="overflow-x-auto rounded-lg border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Type</th>
                                                    <th className="px-4 py-3 font-medium">File Name</th>
                                                    <th className="px-4 py-3 font-medium">Size</th>
                                                    <th className="px-4 py-3 font-medium text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {student.documents.length === 0 ? (
                                                    <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No documents uploaded.</td></tr>
                                                ) : student.documents.map((d) => (
                                                    <tr key={d.id} className="border-t hover:bg-muted/40">
                                                        <td className="px-4 py-3">{d.type}</td>
                                                        <td className="px-4 py-3">{d.original_name}</td>
                                                        <td className="px-4 py-3">{d.size ? `${(d.size / 1024).toFixed(1)} KB` : '-'}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={d.path} download>Download</a>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ── TIMELINE TAB ── */}
                            {activeTab === 'timeline' && (
                                <div className="space-y-4">
                                    {timeline.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <p>No timeline events found.</p>
                                        </div>
                                    ) : (
                                        <div className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                            {timeline.map((event, i) => {
                                                const dotColors: Record<string, string> = {
                                                    admission: 'bg-blue-500',
                                                    fee: 'bg-green-500',
                                                    exam: 'bg-amber-500',
                                                    document: 'bg-purple-500',
                                                };
                                                return (
                                                    <div key={i} className="relative pb-6 last:pb-0">
                                                        <div className={`absolute -left-[23px] size-6 rounded-full border-2 border-background ${dotColors[event.type] ?? 'bg-gray-400'}`} />
                                                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-sm font-semibold capitalize">{event.title}</p>
                                                                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
                                                            </div>
                                                            <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── STUDENT BEHAVIOUR TAB ── */}
                            {activeTab === 'behaviour' && (
                                <div className="p-8 text-center text-muted-foreground">
                                    <p>Student Behaviour records coming soon.</p>
                                </div>
                            )}

                        </div>{/* end tab content */}
                    </div>{/* end right panel */}
                </div>{/* end two-column */}
            </main>
        </>
    );
}

StudentsShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
