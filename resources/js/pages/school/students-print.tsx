import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

type SchoolClass = { id: number; name: string };
type SchoolSection = { id: number; name: string };
type Guardian = { id: number; name: string; phone: string; relation: string; occupation: string | null; address: string | null; email: string | null };
type HostelAllocation = { id: number; is_active: boolean; hostel_room: { id: number; room_no: string; type: string } | null };

type Student = {
    id: number; student_id: string; name: string; name_bn: string | null;
    school_class: SchoolClass | null; section: SchoolSection | null;
    roll_no: number; date_of_birth: string; gender: string;
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
    national_id: string | null; local_id: string | null; note: string | null;
    transport_route_id: number | null; transport_stop_id: number | null;
    hostel_room_id: number | null; photo: string | null; status: string;
    guardians: Guardian[];
    hostel_allocation: HostelAllocation[];
};

type TransportRoute = { id: number; name: string; driver_name: string | null; driver_phone: string | null; vehicle_no: string | null };
type TransportStop = { id: number; name: string };
type HostelRoom = { id: number; room_no: string; type: string };

type Props = {
    student: Student;
    route: TransportRoute | null;
    stop: TransportStop | null;
    hostelRoom: HostelRoom | null;
    settings: Record<string, string>;
};

function Row({ label, value }: { label: string; value?: string | null }) {
    return (
        <tr>
            <td className="label-cell">{label}</td>
            <td className="value-cell">{value || ''}</td>
        </tr>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <tr>
            <td colSpan={2} className="section-header-cell">{title}</td>
        </tr>
    );
}

function SectionHeader3({ title }: { title: string }) {
    return (
        <tr>
            <td colSpan={3} className="section-header-cell">{title}</td>
        </tr>
    );
}

export default function StudentsPrint({ student, route, stop, hostelRoom, settings }: Props) {
    useEffect(() => {
        // auto-trigger print dialog when page loads
        const timer = setTimeout(() => window.print(), 600);
        return () => clearTimeout(timer);
    }, []);

    const schoolName = settings['school_name'] ?? 'Your School Name Here';
    const schoolAddress = settings['school_address'] ?? '';
    const schoolPhone = settings['school_phone'] ?? '';
    const schoolEmail = settings['school_email'] ?? '';
    const schoolFooter = settings['school_footer'] ?? '';

    const photoUrl = student.photo
        ? `/storage/${student.photo}`
        : (student.gender === 'Female'
            ? 'https://placehold.co/80x80/e5e7eb/9ca3af?text=F'
            : 'https://placehold.co/80x80/e5e7eb/9ca3af?text=M');

    // Hostel from direct relation or allocation
    const hostel = hostelRoom ?? student.hostel_allocation.find(h => h.is_active)?.hostel_room ?? null;

    // Guardians
    const father = student.guardians.find(g => g.relation?.toLowerCase() === 'father') ?? null;
    const mother = student.guardians.find(g => g.relation?.toLowerCase() === 'mother') ?? null;
    const guardian = student.guardians[0] ?? null;

    return (
        <>
            <Head title={`${student.name} - Print`} />
            <style>{`
                *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; font-size: 11px; color: #000 !important; background: #fff !important;
                       print-color-adjust: exact; -webkit-print-color-adjust: exact; }

                .print-wrapper { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 0.1in; }

                /* ── Header ── */
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6mm; border-bottom: 2px solid #333 !important; padding-bottom: 4mm; }
                .school-name { font-size: 22px; font-weight: bold; color: #1a1a1a !important; }
                .header-right { text-align: right; font-size: 10px; line-height: 1.7; }
                .header-right strong { font-weight: 600; }

                /* ── Print button (screen only) ── */
                .print-btn { display: flex; justify-content: flex-end; margin-bottom: 4mm; }
                .print-btn button { background: #16a34a; color: #fff; border: none; padding: 6px 18px; border-radius: 4px; font-size: 12px; cursor: pointer; }

                /* ── ALL tables share these rules ── */
                table { width: 100%; border-collapse: collapse !important; margin-bottom: 3mm; table-layout: fixed; }
                td, th { border: 1px solid #666 !important; padding: 3px 7px; vertical-align: top; line-height: 1.6; word-wrap: break-word; }

                .label-cell { font-weight: 700; width: 38%; background-color: #f5f5f5 !important; white-space: nowrap; color: #000 !important; }
                .value-cell  { width: 62%; color: #000 !important; }

                /* ── Section header row ── */
                .section-header-cell { background-color: #e8e8e8 !important; font-weight: 700; font-size: 11px;
                                       text-align: center; letter-spacing: 0.6px; text-transform: uppercase;
                                       padding: 5px 6px !important; color: #000 !important; border: 1px solid #666 !important; }

                /* ── Student photo sidebar ── */
                .student-details-wrapper { display: flex; gap: 0; width: 100%; margin-bottom: 3mm; }
                .student-details-table   { flex: 1; border-collapse: collapse !important; }
                .student-details-table td { border: 1px solid #666 !important; padding: 3px 7px; line-height: 1.6; vertical-align: top; }
                .student-photo-block { width: 90px; border: 1px solid #666 !important; border-left: none !important;
                                       display: flex; flex-direction: column; align-items: center; padding: 6px; gap: 8px; }
                .student-photo-block img { width: 70px; height: 70px; object-fit: cover; border: 1px solid #999 !important; }
                .barcode-img  { width: 70px; height: 28px;
                                background: repeating-linear-gradient(90deg,#000 0,#000 2px,#fff 2px,#fff 5px) !important; }
                .barcode-text { font-size: 8px; text-align: center; font-family: monospace; }
                .qr-placeholder { width: 42px; height: 42px;
                                  background: repeating-conic-gradient(#000 0% 25%,#fff 0% 50%) 0 0/6px 6px !important; }

                /* ── Guardian photo column ── */
                .guardian-photo-td { width: 70px !important; text-align: center; vertical-align: top; padding: 4px !important;
                                     border: 1px solid #666 !important; }
                .no-photo { width: 54px; height: 54px; background-color: #d1d5db !important;
                            display: flex; align-items: center; justify-content: center;
                            font-size: 8px; color: #555 !important; text-align: center; margin: 0 auto; }

                /* ── Footer ── */
                .print-footer { margin-top: 6mm; font-size: 10px; color: #444 !important;
                                border-top: 1px solid #888 !important; padding-top: 3mm; }

                @media print {
                    @page { size: A4 portrait; margin: 0.1in; }
                    body { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
                    .print-btn { display: none !important; }
                    .print-wrapper { padding: 0; width: 100%; }
                    td, th { border: 1px solid #666 !important; }
                    .label-cell { background-color: #f5f5f5 !important; }
                    .section-header-cell { background-color: #e8e8e8 !important; }
                    .no-photo { background-color: #d1d5db !important; }
                    .barcode-img { background: repeating-linear-gradient(90deg,#000 0,#000 2px,#fff 2px,#fff 5px) !important; }
                    .qr-placeholder { background: repeating-conic-gradient(#000 0% 25%,#fff 0% 50%) 0 0/6px 6px !important; }
                }
            `}</style>

            <div className="print-wrapper">
                {/* Print button — screen only */}
                <div className="print-btn">
                    <button onClick={() => window.print()}>🖨 Print / Save PDF</button>
                </div>

                {/* ── HEADER ── */}
                <div className="header">
                    <div className="header-left">
                        <div className="school-name">{schoolName}</div>
                    </div>
                    {(schoolAddress || schoolPhone || schoolEmail) && (
                        <div className="header-right">
                            {schoolAddress && <div><strong>Address:</strong> {schoolAddress}</div>}
                            {schoolPhone && <div><strong>Phone No.:</strong> {schoolPhone}</div>}
                            {schoolEmail && <div><strong>Email:</strong> {schoolEmail}</div>}
                        </div>
                    )}
                </div>

                {/* ── STUDENT DETAILS ── */}
                <div className="student-details-wrapper">
                    <table className="student-details-table">
                        <tbody>
                            <SectionHeader title="Student Details" />
                            <Row label="Name" value={student.name} />
                            <Row label="Admission No" value={student.student_id} />
                            <Row label="Roll No." value={String(student.roll_no)} />
                            <Row label="Class" value={student.school_class?.name} />
                            <Row label="Section" value={student.section?.name} />
                            <Row label="Gender" value={student.gender} />
                            <Row label="Admission Date" value={student.admission_date ?? undefined} />
                            <Row label="Date Of Birth" value={student.date_of_birth} />
                            <Row label="Religion" value={student.religion ?? undefined} />
                            <Row label="Caste" value={student.caste ?? undefined} />
                            <Row label="Mobile Number" value={student.mobile_number ?? undefined} />
                            <Row label="Email" value={student.email ?? undefined} />
                            <Row label="Note" value={student.note ?? undefined} />
                            <Row label="Medical History" value={student.medical_history ?? undefined} />
                        </tbody>
                    </table>
                    {/* Photo + QR + Barcode block */}
                    <div className="student-photo-block">
                        <img src={photoUrl} alt={student.name} />
                        <div className="qr-placeholder" title="QR Code" />
                        <div>
                            <div className="barcode-img" />
                            <div className="barcode-text">{student.student_id}</div>
                        </div>
                    </div>
                </div>

                {/* ── ADDRESS ── */}
                <table className="main-table">
                    <tbody>
                        <SectionHeader title="Address" />
                        <Row label="Current Address" value={student.address ?? undefined} />
                        <Row label="Permanent Address" value={student.address ?? undefined} />
                    </tbody>
                </table>

                {/* ── PARENT GUARDIAN DETAIL ── */}
                <table>
                    <tbody>
                        <SectionHeader3 title="Parent Guardian Detail" />
                        {/* Father */}
                        <tr>
                            <td className="label-cell">Father Name</td>
                            <td className="value-cell">{father?.name ?? student.guardian_name}</td>
                            <td rowSpan={3} className="guardian-photo-td">
                                <div className="no-photo">NO IMAGE</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Father Phone</td>
                            <td className="value-cell">{father?.phone ?? student.guardian_phone}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Father Occupation</td>
                            <td className="value-cell">{father?.occupation ?? ''}</td>
                        </tr>
                        {/* Mother */}
                        <tr>
                            <td className="label-cell">Mother Name</td>
                            <td className="value-cell">{mother?.name ?? student.mother_name ?? ''}</td>
                            <td rowSpan={3} className="guardian-photo-td">
                                <div className="no-photo">NO IMAGE</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Mother Phone</td>
                            <td className="value-cell">{mother?.phone ?? student.mother_phone ?? ''}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Mother Occupation</td>
                            <td className="value-cell">{mother?.occupation ?? ''}</td>
                        </tr>
                        {/* Guardian */}
                        <tr>
                            <td className="label-cell">Guardian Name</td>
                            <td className="value-cell">{guardian?.name ?? student.guardian_name}</td>
                            <td rowSpan={6} className="guardian-photo-td">
                                <div className="no-photo">NO IMAGE</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Guardian Email</td>
                            <td className="value-cell">{guardian?.email ?? ''}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Guardian Relation</td>
                            <td className="value-cell">{guardian?.relation ?? ''}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Guardian Phone</td>
                            <td className="value-cell">{guardian?.phone ?? student.guardian_phone}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Guardian Occupation</td>
                            <td className="value-cell">{guardian?.occupation ?? ''}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Guardian Address</td>
                            <td className="value-cell">{guardian?.address ?? ''}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ── ROUTE DETAILS ── */}
                <table className="main-table">
                    <tbody>
                        <SectionHeader title="Route Details" />
                        <Row label="Pick-up Point" value={stop?.name} />
                        <Row label="Route" value={route?.name} />
                        <Row label="Vehicle Number" value={route?.vehicle_no ?? undefined} />
                        <Row label="Driver Name" value={route?.driver_name ?? undefined} />
                        <Row label="Driver Contact" value={route?.driver_phone ?? undefined} />
                    </tbody>
                </table>

                {/* ── HOSTEL DETAILS ── */}
                {hostel && (
                    <table className="main-table">
                        <tbody>
                            <SectionHeader title="Hostel Details" />
                            <Row label="Hostel" value={`Hostel ${hostel.room_no}`} />
                            <Row label="Room No." value={hostel.room_no} />
                            <Row label="Room Type" value={hostel.type} />
                        </tbody>
                    </table>
                )}

                {/* ── MISCELLANEOUS DETAILS ── */}
                <table className="main-table">
                    <tbody>
                        <SectionHeader title="Miscellaneous Details" />
                        <Row label="Blood Group" value={student.blood_group ?? undefined} />
                        <Row label="House" value={student.house ?? undefined} />
                        <Row label="Height" value={student.height ?? undefined} />
                        <Row label="Weight" value={student.weight ?? undefined} />
                        <Row label="Measurement Date" value={student.measurement_date ?? undefined} />
                        <Row label="Previous School Details" value={student.previous_school ?? undefined} />
                        <Row label="National Identification Number" value={student.national_id ?? undefined} />
                        <Row label="Local Identification Number" value={student.local_id ?? undefined} />
                    </tbody>
                </table>

                {/* ── FOOTER ── */}
                {schoolFooter && (
                    <div className="print-footer">{schoolFooter}</div>
                )}
            </div>
        </>
    );
}

// No layout wrapper — this is a full standalone print page
StudentsPrint.layout = (page: React.ReactNode) => <>{page}</>;
