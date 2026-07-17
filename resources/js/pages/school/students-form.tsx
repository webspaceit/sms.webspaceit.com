import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Upload, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/students' },
    { title: 'Manage', href: '' },
];

type SchoolClass = { id: number; name: string };
type SchoolSection = { id: number; name: string; class_id: number };
type RouteOption = { id: number; name: string };
type StopOption = { id: number; name: string; transport_route_id: number };
type HostelRoom = { id: number; room_no: string; type: string };
type FeeStructure = { id: number; class_id: number; amount: string; fee_head: { id: number; name: string } | null };

type Student = {
    id: number; student_id: string; name: string; name_bn: string | null;
    class_id: number; section_id: number; roll_no: number;
    date_of_birth: string; gender: string;
    caste: string | null; mobile_number: string | null;
    religion: string | null; nationality: string | null;
    guardian_name: string; guardian_phone: string;
    mother_name: string | null; mother_phone: string | null;
    email: string | null; birth_certificate_no: string | null;
    previous_school: string | null; admission_date: string | null;
    district: string; address: string | null;
    blood_group: string | null; house: string | null;
    height: string | null; weight: string | null;
    measurement_date: string | null; medical_history: string | null;
    national_id: string | null;
    local_id: string | null; note: string | null;
    transport_route_id: number | null; transport_stop_id: number | null;
    fees_month: string | null; hostel_room_id: number | null;
    status: string;
    guardians?: { id: number }[];
};

type Props = {
    student?: Student;
    isEdit: boolean;
    classes: SchoolClass[];
    sections: SchoolSection[];
    routes: RouteOption[];
    stops: StopOption[];
    hostelRooms: HostelRoom[];
    feeStructures: FeeStructure[];
    studentHouses: { id: number; name: string }[];
    allStudents: { id: number; name: string; student_id: string }[];
    siblingIds?: number[];
    admissionNo?: string;
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female', 'Other'];
const statuses = ['active', 'inactive', 'alumni'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const religions = ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'];
const today = new Date().toISOString().slice(0, 10);

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-0">
            {title && (
                <div className="bg-muted/50 border-y px-4 py-2 mb-4">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                </div>
            )}
            <div className="px-4">{children}</div>
        </div>
    );
}

function FieldError({ error }: { error?: string }) {
    return error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null;
}

export default function StudentsForm({ student, isEdit, classes, sections, routes, stops, hostelRooms, feeStructures, studentHouses, allStudents, siblingIds, admissionNo }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        student_id: student?.student_id ?? admissionNo ?? '',
        name: student?.name ?? '',
        name_bn: student?.name_bn ?? '',
        class_id: student?.class_id?.toString() ?? '',
        section_id: student?.section_id?.toString() ?? '',
        student_house_id: (student as any)?.student_house?.id?.toString() ?? student?.student_house_id?.toString() ?? '',
        roll_no: student?.roll_no?.toString() ?? '',
        date_of_birth: student?.date_of_birth ?? '',
        gender: student?.gender ?? '',
        caste: student?.caste ?? '',
        mobile_number: student?.mobile_number ?? '',
        religion: student?.religion ?? '',
        nationality: student?.nationality ?? 'Bangladeshi',
        admission_date: student?.admission_date ?? today,
        blood_group: student?.blood_group ?? '',
        house: student?.house ?? '',
        height: student?.height ?? '',
        weight: student?.weight ?? '',
        measurement_date: student?.measurement_date ?? today,
        medical_history: student?.medical_history ?? '',
        // Parent/Guardian
        guardian_name: student?.guardian_name ?? '',
        guardian_phone: student?.guardian_phone ?? '',
        mother_name: student?.mother_name ?? '',
        mother_phone: student?.mother_phone ?? '',
        email: student?.email ?? '',
        birth_certificate_no: student?.birth_certificate_no ?? '',
        previous_school: student?.previous_school ?? '',
        district: student?.district ?? '',
        address: student?.address ?? '',
        national_id: student?.national_id ?? '',
        local_id: student?.local_id ?? '',
        transport_route_id: (student as any)?.transportRoute?.id?.toString() ?? student?.transport_route_id?.toString() ?? '',
        transport_stop_id: (student as any)?.transportStop?.id?.toString() ?? student?.transport_stop_id?.toString() ?? '',
        fees_month: student?.fees_month ?? 'January',
        hostel_room_id: (student as any)?.hostelRoom?.id?.toString() ?? student?.hostel_room_id?.toString() ?? '',
        status: student?.status ?? 'active',
        note: student?.note ?? '',
        sibling_ids: (isEdit ? siblingIds : []) ?? [] as number[],
        doc_titles: ['', '', '', ''],
        doc_files: [null, null, null, null] as (File | null)[],
    });

    const studentFileRef = useRef<HTMLInputElement>(null);
    const fatherFileRef = useRef<HTMLInputElement>(null);
    const motherFileRef = useRef<HTMLInputElement>(null);
    const guardianFileRef = useRef<HTMLInputElement>(null);
    const docFileRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

    const [studentPreview, setStudentPreview] = useState<string | null>(student?.photo ?? null);
    const [fatherPreview, setFatherPreview] = useState<string | null>(student?.father_photo ?? null);
    const [motherPreview, setMotherPreview] = useState<string | null>(student?.mother_photo ?? null);
    const [guardianPreview, setGuardianPreview] = useState<string | null>(student?.guardian_photo ?? null);
    const [studentDragOver, setStudentDragOver] = useState(false);

    const [docPreviews, setDocPreviews] = useState<(string | null)[]>([null, null, null, null]);
    const [showSiblingSearch, setShowSiblingSearch] = useState(false);

    const handleImageSelect = (file: File, previewSetter: (v: string | null) => void, dataKey: string) => {
        if (!file.type.startsWith('image/')) return;
        setData(dataKey as any, file);
        const reader = new FileReader();
        reader.onload = (e) => previewSetter(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = (previewSetter: (v: string | null) => void, dataKey: string, ref: React.RefObject<HTMLInputElement | null>) => {
        previewSetter(null);
        setData(dataKey as any, null);
        if (ref.current) ref.current.value = '';
    };

    const handleDocFileSelect = (index: number, file: File) => {
        const f = [...data.doc_files] as (File | null)[];
        f[index] = file;
        setData('doc_files', f);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setDocPreviews((prev) => { const c = [...prev]; c[index] = e.target?.result as string; return c; });
            reader.readAsDataURL(file);
        }
    };

    const filteredSections = useMemo(
        () => !data.class_id ? [] : sections.filter((s) => s.class_id === Number(data.class_id)),
        [sections, data.class_id],
    );
    const filteredStops = useMemo(
        () => stops.filter((s) => !data.transport_route_id || s.transport_route_id === Number(data.transport_route_id)),
        [stops, data.transport_route_id],
    );
    const filteredFees = useMemo(
        () => feeStructures.filter((f) => !data.class_id || f.class_id === Number(data.class_id)),
        [feeStructures, data.class_id],
    );

    const opt = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
    const routeOptions = useMemo(() => routes.map((r) => ({ value: String(r.id), label: r.name })), [routes]);
    const stopOptions = useMemo(() => filteredStops.map((s) => ({ value: String(s.id), label: s.name })), [filteredStops]);
    const hostelOptions = useMemo(() => hostelRooms.map((h) => ({ value: String(h.id), label: `${h.room_no} (${h.type})` })), [hostelRooms]);

    const siblingOptions = useMemo(
        () => allStudents
            .filter((s) => s.id !== student?.id)
            .map((s) => ({ value: String(s.id), label: `${s.name} (${s.student_id})` })),
        [allStudents, student?.id],
    );

    const siblingMap = useMemo(
        () => new Map(allStudents.map((s) => [s.id, s])),
        [allStudents],
    );

    const addSibling = (value: string) => {
        const id = Number(value);
        if (id && !data.sibling_ids.includes(id)) {
            setData('sibling_ids', [...data.sibling_ids, id]);
        }
        setShowSiblingSearch(false);
    };

    const removeSibling = (id: number) => {
        setData('sibling_ids', data.sibling_ids.filter((sid) => sid !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && student) { put(`/students/${student.id}`, { forceFormData: true }); }
        else { post('/students', { forceFormData: true }); }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Student' : 'Student Admission'} />
            <main className="flex flex-1 flex-col p-4 md:p-6 max-w-5xl mx-auto w-full">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-lg font-semibold">Student Admission</h1>

                </div>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card shadow-sm overflow-hidden space-y-0">

                    {/* ── Row 1: Admission No, Class, Section, Roll Number ── */}
                    <div className="px-4 pt-4 pb-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Admission No <span className="text-red-500">*</span></Label>
                            <Input className="mt-1" value={data.student_id} onChange={(e) => setData('student_id', e.target.value)} placeholder="Admission No" required readOnly={!isEdit && !!admissionNo} />
                            <FieldError error={errors.student_id} />
                        </div>
                        <div>
                            <Label>Class <span className="text-red-500">*</span></Label>
                            <div className="mt-1">
                                <Select value={data.class_id} onValueChange={(v) => { setData('class_id', v); setData('section_id', ''); }}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <FieldError error={errors.class_id} />
                        </div>
                        <div>
                            <Label>Section <span className="text-red-500">*</span></Label>
                            <div className="mt-1">
                                <Select value={data.section_id} onValueChange={(v) => setData('section_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>{filteredSections.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <FieldError error={errors.section_id} />
                        </div>
                        <div>
                            <Label>Roll Number</Label>
                            <Input className="mt-1" type="number" value={data.roll_no} onChange={(e) => setData('roll_no', e.target.value)} placeholder="Roll Number" />
                            <FieldError error={errors.roll_no} />
                        </div>
                    </div>

                    {/* ── Row 2: First Name, Last Name, Gender, DOB ── */}
                    <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <Label>First Name <span className="text-red-500">*</span></Label>
                            <Input className="mt-1" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="First Name" required />
                            <FieldError error={errors.name} />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input className="mt-1" value={data.name_bn} onChange={(e) => setData('name_bn', e.target.value)} placeholder="Last Name (Bangla)" />
                        </div>
                        <div>
                            <Label>Gender <span className="text-red-500">*</span></Label>
                            <div className="mt-1">
                                <SearchableSelect options={opt(genders)} value={data.gender}
                                    onChange={(v) => setData('gender', v)} placeholder="Select" />
                            </div>
                            <FieldError error={errors.gender} />
                        </div>
                        <div>
                            <Label>Date Of Birth <span className="text-red-500">*</span></Label>
                            <Input className="mt-1" type="date" value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)} required />
                            <FieldError error={errors.date_of_birth} />
                        </div>
                    </div>

                    {/* ── Row 3: Religion, Caste, Mobile, Email ── */}
                    <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Religion</Label>
                            <div className="mt-1">
                                <SearchableSelect options={opt(religions)} value={data.religion}
                                    onChange={(v) => setData('religion', v)} placeholder="Select" />
                            </div>
                        </div>
                        <div>
                            <Label>Caste</Label>
                            <Input className="mt-1" value={data.caste} onChange={(e) => setData('caste', e.target.value)} placeholder="Caste" />
                        </div>
                        <div>
                            <Label>Mobile Number</Label>
                            <Input className="mt-1" value={data.mobile_number} onChange={(e) => setData('mobile_number', e.target.value)} placeholder="Mobile Number" />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input className="mt-1" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email" />
                        </div>
                    </div>

                    {/* ── Row 4: Admission Date, Photo, Blood Group, House ── */}
                    <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <Label>Admission Date</Label>
                            <Input className="mt-1" type="date" value={data.admission_date}
                                onChange={(e) => setData('admission_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Student Photo (100px X 100px)</Label>
                            <div
                                className={`mt-1 relative flex items-center justify-center border-2 border-dashed rounded-md h-10 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 gap-2 overflow-hidden ${studentDragOver ? 'border-primary bg-primary/10' : ''}`}
                                onClick={() => studentFileRef.current?.click()}
                                onDrop={(e) => { e.preventDefault(); setStudentDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImageSelect(f, setStudentPhoto); }}
                                onDragOver={(e) => { e.preventDefault(); setStudentDragOver(true); }}
                                onDragLeave={() => setStudentDragOver(false)}
                            >
                                {studentPreview ? (
                                    <>
                                        <img src={studentPreview} alt="Preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeImage(setStudentPreview, 'photo', studentFileRef); }}
                                            className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-background"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <><Upload className="size-3.5" /> Drag and drop a file here or click</>
                                )}
                            </div>
                            <input ref={studentFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], setStudentPreview, 'photo')} />
                        </div>
                        <div>
                            <Label>Blood Group</Label>
                            <div className="mt-1">
                                <SearchableSelect options={opt(bloodGroups)} value={data.blood_group}
                                    onChange={(v) => setData('blood_group', v)} placeholder="Select" />
                            </div>
                        </div>
                        <div>
                            <Label>Student House</Label>
                            <div className="mt-1">
                                <SearchableSelect
                                    options={studentHouses.map((h) => ({ value: String(h.id), label: h.name }))}
                                    value={data.student_house_id}
                                    onChange={(v) => setData('student_house_id', v)}
                                    placeholder="Select House" />
                            </div>
                        </div>
                    </div>

                    {/* ── Row 5: Height, Weight, Measurement Date, Siblings ── */}
                    <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                        <div>
                            <Label>Height</Label>
                            <Input className="mt-1" type="number" step="0.01" value={data.height}
                                onChange={(e) => setData('height', e.target.value)} placeholder="Height (cm)" />
                        </div>
                        <div>
                            <Label>Weight</Label>
                            <Input className="mt-1" type="number" step="0.01" value={data.weight}
                                onChange={(e) => setData('weight', e.target.value)} placeholder="Weight (kg)" />
                        </div>
                        <div>
                            <Label>Measurement Date</Label>
                            <Input className="mt-1" type="date" value={data.measurement_date}
                                onChange={(e) => setData('measurement_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Siblings</Label>
                            <div className="mt-1 space-y-1">
                                {data.sibling_ids.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {data.sibling_ids.map((sid) => {
                                            const s = siblingMap.get(sid);
                                            return (
                                                <span key={sid} className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                                                    {s?.name ?? `#${sid}`}
                                                    <button type="button" onClick={() => removeSibling(sid)} className="hover:text-red-600">
                                                        <X className="size-3" />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                                {showSiblingSearch ? (
                                    <div className="relative">
                                        <SearchableSelect
                                            options={siblingOptions}
                                            value=""
                                            onChange={addSibling}
                                            placeholder="Search student..."
                                        />
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setShowSiblingSearch(true)}
                                        className="text-sm text-primary hover:underline font-medium">+ Add Sibling</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Medical History ── */}
                    <div className="px-4 py-2">
                        <Label>Medical History</Label>
                        <textarea
                            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                            rows={2}
                            value={data.medical_history}
                            onChange={(e) => setData('medical_history', e.target.value)}
                            placeholder="Medical History"
                        />
                    </div>

                    <div className="pb-2" />

                    {/* ── TRANSPORT DETAILS ── */}
                    <FormSection title="Transport Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                            <div>
                                <Label>Route List</Label>
                                <div className="mt-1">
                                    <SearchableSelect options={routeOptions} value={data.transport_route_id}
                                        onChange={(v) => { setData('transport_route_id', v); setData('transport_stop_id', ''); }}
                                        placeholder="Select" />
                                </div>
                            </div>
                            <div>
                                <Label>Pickup Point</Label>
                                <div className="mt-1">
                                    <SearchableSelect options={stopOptions} value={data.transport_stop_id}
                                        onChange={(v) => setData('transport_stop_id', v)} placeholder="Select" />
                                </div>
                            </div>
                            <div>
                                <Label>Fees Month</Label>
                                <div className="mt-1">
                                    <SearchableSelect options={opt(months)} value={data.fees_month}
                                        onChange={(v) => setData('fees_month', v)} placeholder="Select Month" />
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* ── HOSTEL DETAILS ── */}
                    <FormSection title="Hostel Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            <div>
                                <Label>Hostel</Label>
                                <div className="mt-1">
                                    <SearchableSelect options={hostelOptions} value={data.hostel_room_id}
                                        onChange={(v) => setData('hostel_room_id', v)} placeholder="Select" />
                                </div>
                            </div>
                            <div>
                                <Label>Room No.</Label>
                                <div className="mt-1">
                                    <SearchableSelect options={hostelOptions} value={data.hostel_room_id}
                                        onChange={(v) => setData('hostel_room_id', v)} placeholder="Select" />
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* ── FEES DETAILS ── */}
                    {filteredFees.length > 0 && (
                        <FormSection title="Fees Details">
                            <div className="pb-4 space-y-0 divide-y border rounded-md overflow-hidden">
                                {filteredFees.map((fee) => (
                                    <div key={fee.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground text-xs">+</span>
                                            <input type="checkbox" className="size-4 rounded" />
                                            <span className="text-sm text-primary">{fee.fee_head?.name ?? 'Fee'}</span>
                                        </div>
                                        <span className="text-sm font-medium">{Number(fee.amount).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </FormSection>
                    )}

                    {/* ── PARENT GUARDIAN DETAIL ── */}
                    <FormSection title="Parent Guardian Detail">
                        <div className="pb-4 space-y-4">
                            {/* Father row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Father Name</Label>
                                    <Input className="mt-1" value={data.guardian_name}
                                        onChange={(e) => setData('guardian_name', e.target.value)} placeholder="Father Name" />
                                    <FieldError error={errors.guardian_name} />
                                </div>
                                <div>
                                    <Label>Father Phone</Label>
                                    <Input className="mt-1" value={data.guardian_phone}
                                        onChange={(e) => setData('guardian_phone', e.target.value)} placeholder="Father Phone" />
                                    <FieldError error={errors.guardian_phone} />
                                </div>
                                <div>
                                    <Label>Father Occupation</Label>
                                    <Input className="mt-1" placeholder="Father Occupation" />
                                </div>
                                <div>
                                    <Label>Father Photo (100px X 100px)</Label>
                                    <div
                                        className="mt-1 relative flex items-center justify-center border-2 border-dashed rounded-md h-10 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 gap-1 overflow-hidden"
                                        onClick={() => fatherFileRef.current?.click()}
                                    >
                                        {fatherPreview ? (
                                            <>
                                                <img src={fatherPreview} alt="Preview" className="h-full w-full object-cover" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(setFatherPreview, 'father_photo', fatherFileRef); }} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background"><X className="size-3" /></button>
                                            </>
                                        ) : (
                                            <><Upload className="size-3" /> Drag and drop a file here or click</>
                                        )}
                                    </div>
                                    <input ref={fatherFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], setFatherPreview, 'father_photo')} />
                                </div>
                            </div>
                            {/* Mother row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Mother Name</Label>
                                    <Input className="mt-1" value={data.mother_name}
                                        onChange={(e) => setData('mother_name', e.target.value)} placeholder="Mother Name" />
                                </div>
                                <div>
                                    <Label>Mother Phone</Label>
                                    <Input className="mt-1" value={data.mother_phone}
                                        onChange={(e) => setData('mother_phone', e.target.value)} placeholder="Mother Phone" />
                                </div>
                                <div>
                                    <Label>Mother Occupation</Label>
                                    <Input className="mt-1" placeholder="Mother Occupation" />
                                </div>
                                <div>
                                    <Label>Mother Photo (100px X 100px)</Label>
                                    <div
                                        className="mt-1 relative flex items-center justify-center border-2 border-dashed rounded-md h-10 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 gap-1 overflow-hidden"
                                        onClick={() => motherFileRef.current?.click()}
                                    >
                                        {motherPreview ? (
                                            <>
                                                <img src={motherPreview} alt="Preview" className="h-full w-full object-cover" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(setMotherPreview, 'mother_photo', motherFileRef); }} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background"><X className="size-3" /></button>
                                            </>
                                        ) : (
                                            <><Upload className="size-3" /> Drag and drop a file here or click</>
                                        )}
                                    </div>
                                    <input ref={motherFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], setMotherPreview, 'mother_photo')} />
                                </div>
                            </div>
                            {/* Guardian Is */}
                            <div className="flex items-center gap-4">
                                <Label>If Guardian Is :</Label>
                                {['Father', 'Mother', 'Other'].map((opt) => (
                                    <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer">
                                        <input type="radio" name="guardian_is" value={opt}
                                            checked={data.guardian_is === opt}
                                            onChange={() => setData('guardian_is', opt)}
                                            className="size-4" />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                            {/* Guardian details row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Guardian Name <span className="text-red-500">*</span></Label>
                                    <Input className="mt-1" value={data.guardian_name}
                                        onChange={(e) => setData('guardian_name', e.target.value)} placeholder="Guardian Name" />
                                </div>
                                <div>
                                    <Label>Guardian Relation</Label>
                                    <Input className="mt-1" value={data.guardian_relation}
                                        onChange={(e) => setData('guardian_relation', e.target.value)} placeholder="Relation" />
                                </div>
                                <div>
                                    <Label>Guardian Email</Label>
                                    <Input className="mt-1" type="email" value={data.guardian_email}
                                        onChange={(e) => setData('guardian_email', e.target.value)} placeholder="Guardian Email" />
                                </div>
                                <div>
                                    <Label>Guardian Photo (100px X 100px)</Label>
                                    <div
                                        className="mt-1 relative flex items-center justify-center border-2 border-dashed rounded-md h-10 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 gap-1 overflow-hidden"
                                        onClick={() => guardianFileRef.current?.click()}
                                    >
                                        {guardianPreview ? (
                                            <>
                                                <img src={guardianPreview} alt="Preview" className="h-full w-full object-cover" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(setGuardianPreview, 'guardian_photo', guardianFileRef); }} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background"><X className="size-3" /></button>
                                            </>
                                        ) : (
                                            <><Upload className="size-3" /> Drag and drop a file here or click</>
                                        )}
                                    </div>
                                    <input ref={guardianFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], setGuardianPreview, 'guardian_photo')} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Guardian Phone <span className="text-red-500">*</span></Label>
                                    <Input className="mt-1" value={data.guardian_phone}
                                        onChange={(e) => setData('guardian_phone', e.target.value)} placeholder="Guardian Phone" />
                                </div>
                                <div>
                                    <Label>Guardian Occupation</Label>
                                    <Input className="mt-1" value={data.guardian_occupation}
                                        onChange={(e) => setData('guardian_occupation', e.target.value)} placeholder="Guardian Occupation" />
                                </div>
                                <div>
                                    <Label>Guardian Address</Label>
                                    <Input className="mt-1" value={data.guardian_address}
                                        onChange={(e) => setData('guardian_address', e.target.value)} placeholder="Guardian Address" />
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* ── ADD MORE DETAILS (collapsible-style header) ── */}
                    <div className="bg-muted/50 border-y px-4 py-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Add More Details</h3>
                        <span className="text-muted-foreground text-xs">−</span>
                    </div>

                    {/* ── STUDENT ADDRESS DETAILS ── */}
                    <div className="bg-muted/30 border-b px-4 py-2">
                        <h4 className="text-sm font-medium text-foreground">Student Address Details</h4>
                    </div>
                    <div className="px-4 py-3 space-y-3">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="size-4 rounded" />
                                If Guardian Address Is Current Address
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="size-4 rounded" />
                                If Permanent Address Is Current Address
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Current Address</Label>
                                <textarea
                                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    rows={3}
                                    value={data.current_address}
                                    onChange={(e) => setData('current_address', e.target.value)}
                                    placeholder="Current Address"
                                />
                            </div>
                            <div>
                                <Label>Permanent Address</Label>
                                <textarea
                                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    rows={3}
                                    value={data.permanent_address}
                                    onChange={(e) => setData('permanent_address', e.target.value)}
                                    placeholder="Permanent Address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── MISCELLANEOUS DETAILS ── */}
                    <div className="bg-muted/30 border-y px-4 py-2">
                        <h4 className="text-sm font-medium text-foreground">Miscellaneous Details</h4>
                    </div>
                    <div className="px-4 py-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>National Identification Number</Label>
                                <Input className="mt-1" value={data.national_id}
                                    onChange={(e) => setData('national_id', e.target.value)}
                                    placeholder="National ID" />
                            </div>
                            <div>
                                <Label>Local Identification Number</Label>
                                <Input className="mt-1" value={data.local_id}
                                    onChange={(e) => setData('local_id', e.target.value)}
                                    placeholder="Local ID / Birth Certificate No" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Previous School Details</Label>
                                <textarea
                                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    rows={3}
                                    value={data.previous_school}
                                    onChange={(e) => setData('previous_school', e.target.value)}
                                    placeholder="Previous School Details"
                                />
                            </div>
                            <div>
                                <Label>Note</Label>
                                <textarea
                                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    rows={3}
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Note"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── UPLOAD DOCUMENTS ── */}
                    <div className="bg-muted/50 border-y px-4 py-2">
                        <h3 className="text-sm font-semibold text-foreground">Upload Documents</h3>
                    </div>
                    <div className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {/* Left column: slots 1 & 2 (indices 0,1) */}
                            <div className="space-y-3">
                                {[0, 1].map((i) => (
                                    <div key={i} className="grid grid-cols-[2rem_1fr_1fr] gap-2 items-center">
                                        <span className="text-sm text-muted-foreground text-right">{i + 1}.</span>
                                        <Input placeholder="Title" className="text-sm" value={data.doc_titles[i]}
                                            onChange={(e) => { const t = [...data.doc_titles]; t[i] = e.target.value; setData('doc_titles', t); }} />
                                        <div
                                            className="relative flex items-center justify-center border-2 border-dashed rounded-md h-10 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 gap-1 px-2 overflow-hidden"
                                            onClick={() => docFileRefs.current[i]?.click()}
                                        >
                                            {docPreviews[i] ? (
                                                <>
                                                    <img src={docPreviews[i]!} alt="" className="h-full w-full object-cover" />
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setDocPreviews((prev) => { const c = [...prev]; c[i] = null; return c; }); const f = [...data.doc_files]; f[i] = null; setData('doc_files', f); if (docFileRefs.current[i]) docFileRefs.current[i]!.value = ''; }} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background"><X className="size-2.5" /></button>
                                                </>
                                            ) : data.doc_files[i] ? (
                                                <span className="truncate">{data.doc_files[i]!.name}</span>
                                            ) : (
                                                <><Upload className="size-3 shrink-0" /><span className="truncate">Drag and drop or click</span></>
                                            )}
                                        </div>
                                        <input ref={(el) => { docFileRefs.current[i] = el; }} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleDocFileSelect(i, e.target.files[0])} />
                                    </div>
                                ))}
                            </div>
                            {/* Right column: slots 3 & 4 (indices 2,3) */}
                            <div className="space-y-3">
                                {[2, 3].map((i) => (
                                    <div key={i} className="grid grid-cols-[2rem_1fr_1fr] gap-2 items-center">
                                        <span className="text-sm text-muted-foreground text-right">{i + 1}.</span>
                                        <Input placeholder="Title" className="text-sm" value={data.doc_titles[i]}
                                            onChange={(e) => { const t = [...data.doc_titles]; t[i] = e.target.value; setData('doc_titles', t); }} />
                                        <div
                                            className="relative flex items-center justify-center border-2 border-dashed rounded-md h-10 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 gap-1 px-2 overflow-hidden"
                                            onClick={() => docFileRefs.current[i]?.click()}
                                        >
                                            {docPreviews[i] ? (
                                                <>
                                                    <img src={docPreviews[i]!} alt="" className="h-full w-full object-cover" />
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setDocPreviews((prev) => { const c = [...prev]; c[i] = null; return c; }); const f = [...data.doc_files]; f[i] = null; setData('doc_files', f); if (docFileRefs.current[i]) docFileRefs.current[i]!.value = ''; }} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background"><X className="size-2.5" /></button>
                                                </>
                                            ) : data.doc_files[i] ? (
                                                <span className="truncate">{data.doc_files[i]!.name}</span>
                                            ) : (
                                                <><Upload className="size-3 shrink-0" /><span className="truncate">Drag and drop or click</span></>
                                            )}
                                        </div>
                                        <input ref={(el) => { docFileRefs.current[i] = el; }} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleDocFileSelect(i, e.target.files[0])} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── SUBMIT BUTTON ── */}
                    <div className="flex justify-end gap-3 px-4 py-4 border-t bg-muted/20">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/students">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" />
                            {isEdit ? 'Update Student' : 'Save'}
                        </Button>
                    </div>

                </form>
            </main>
        </>
    );
}

StudentsForm.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
