import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Student = {
    id: number;
    student_id: string;
    name: string;
    class_name: string;
    section: string;
    roll_no: number;
    guardian_name: string;
    date_of_birth: string;
};

type Mark = {
    id: number;
    subject_name: string;
    full_marks: number;
    highest_marks: number;
    written_marks: number | null;
    mcq_marks: number | null;
    practical_marks: number | null;
    ca_marks: number | null;
    total_marks: number;
    grade_point: number;
    letter_grade: string;
};

type AcademicReport = {
    id: number;
    student_id: number;
    exam_name: string;
    academic_year: string;
    class_position: number | null;
    working_days: number;
    present_days: number;
    absent_days: number;
    moral_evaluation: string | null;
    co_curricular: string[] | null;
    comments: string | null;
    student: Student;
    marks: Mark[];
};

type CalculatedStats = {
    total_full_marks: number;
    total_obtained_marks: number;
    gpa: number;
    grade: string;
    status: string;
    failed_count: number;
};

type ReportsShowProps = {
    report: AcademicReport;
    calculated: CalculatedStats;
    school: {
        name: string;
        address: string;
    };
};

const gradeScale = [
    { range: '80-100', grade: 'A+', gp: '5.0' },
    { range: '70-79', grade: 'A', gp: '4.0' },
    { range: '60-69', grade: 'A-', gp: '3.5' },
    { range: '50-59', grade: 'B', gp: '3.0' },
    { range: '40-49', grade: 'C', gp: '2.0' },
    { range: '33-39', grade: 'D', gp: '1.0' },
    { range: '00-32', grade: 'F', gp: '0.0' },
];

export default function ReportsShow({ report, calculated, school }: ReportsShowProps) {
    const handlePrint = () => {
        window.print();
    };

    // Co-curricular checkboxes
    const activities = ['Sports', 'Cultural Function', 'Scout/BNCC', 'Math Olympiad'];
    const activeActivities = report.co_curricular ?? [];

    // Moral evaluation checklist
    const moralGrades = ['Excellent', 'Good', 'Average', 'Poor'];
    const activeMoral = report.moral_evaluation ?? 'Excellent';

    return (
        <>
            <Head title={`Progress Report - ${report.student.name}`} />

            {/* Scoped CSS for the report layout and printing */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .report-page-container {
                    background-color: #f5f5f5;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                }
                .report-card-sheet {
                    background: white;
                    width: 790px;
                    min-height: 1120px;
                    margin: 0 auto;
                    padding: 30px;
                    box-sizing: border-box;
                    font-family: 'Instrument Sans', 'Arial', sans-serif;
                    color: #111;
                    border: 4px double #b59410;
                    outline: 1px solid #111;
                    outline-offset: -3px;
                    position: relative;
                }
                
                .report-title-section {
                    text-align: center;
                    margin-bottom: 15px;
                }
                .report-title-section h1 {
                    font-size: 26px;
                    font-weight: 700;
                    margin: 0;
                    color: #0b2240;
                    letter-spacing: 0.5px;
                }
                .report-title-section p {
                    font-size: 11px;
                    color: #555;
                    margin: 2px 0 0 0;
                }

                .report-header-grid {
                    display: grid;
                    grid-template-cols: 100px 1fr 160px;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .student-avatar-box {
                    width: 90px;
                    height: 105px;
                    border: 1px solid #111;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: #f0f0f0;
                }
                .student-avatar-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .report-badge-container {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .report-badge-logo {
                    width: 48px;
                    height: 48px;
                    background: #0f4c81;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .report-badge-text {
                    font-size: 12px;
                    font-weight: 800;
                    color: #1b4d3e;
                    border-bottom: 2px solid #1b4d3e;
                    padding: 2px 10px;
                    margin-top: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .grade-scale-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                    text-align: center;
                }
                .grade-scale-table th, .grade-scale-table td {
                    border: 1px solid #333;
                    padding: 2px 4px;
                }
                .grade-scale-table th {
                    background: #f2f2f2;
                    font-weight: bold;
                }

                .student-info-grid {
                    display: grid;
                    grid-template-cols: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 15px;
                    font-size: 11.5px;
                }
                .info-row {
                    display: flex;
                    margin-bottom: 4px;
                }
                .info-label {
                    width: 130px;
                    font-weight: 600;
                }
                .info-colon {
                    width: 15px;
                }
                .info-value {
                    flex: 1;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .marks-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                    font-size: 10px;
                }
                .marks-table th, .marks-table td {
                    border: 1px solid #111;
                    padding: 4px 6px;
                    text-align: center;
                }
                .marks-table th {
                    font-weight: 700;
                    background: #ebf5eb;
                    color: #111;
                }
                .marks-table th.main-header {
                    background: #ebf5eb;
                }
                .marks-table td.subject-name {
                    text-align: left;
                    font-weight: 600;
                }
                .marks-table tr.total-row {
                    font-weight: 700;
                    font-size: 11px;
                    color: #1e7e34;
                    background: #f4faf4;
                }
                .marks-table tr.total-row td {
                    border-top: 2px solid #1e7e34;
                    border-bottom: 2px solid #1e7e34;
                }

                .lower-details-grid {
                    display: grid;
                    grid-template-cols: 1fr 1.3fr 1.3fr 130px;
                    gap: 12px;
                    margin-bottom: 30px;
                }

                .mini-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                }
                .mini-table th, .mini-table td {
                    border: 1px solid #111;
                    padding: 4px 6px;
                }
                .mini-table th {
                    background: #ebf5eb;
                    font-weight: 700;
                    text-align: center;
                }
                .mini-table td.label-col {
                    font-weight: 600;
                }
                .mini-table td.val-col {
                    text-align: center;
                    font-weight: 700;
                }

                .evaluation-box {
                    border: 1px solid #111;
                    padding: 6px;
                    font-size: 10px;
                }
                .evaluation-box h3 {
                    font-weight: 700;
                    background: #ebf5eb;
                    text-align: center;
                    border: 1px solid #111;
                    padding: 2px;
                    margin: 0 0 6px 0;
                    text-transform: uppercase;
                    font-size: 9.5px;
                }
                .checkbox-list-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 3px;
                    padding: 1px 4px;
                }
                .checkbox-list-row.active {
                    background: #ebf5eb;
                    font-weight: bold;
                }
                .checkbox-indicator {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border: 1px solid #111;
                    text-align: center;
                    line-height: 10px;
                    font-size: 9px;
                    font-weight: bold;
                }

                .comments-box {
                    grid-column: 1 / span 3;
                    border: 1px solid #111;
                    padding: 6px 10px;
                    font-size: 10.5px;
                    min-height: 45px;
                }
                .comments-box span {
                    font-weight: 700;
                }

                .qr-code-box {
                    border: 1px solid #111;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px;
                    height: 110px;
                    box-sizing: border-box;
                }

                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 50px;
                    padding: 0 30px;
                    font-size: 11px;
                }
                .signature-block {
                    text-align: center;
                    width: 150px;
                }
                .signature-line {
                    border-top: 1px solid #111;
                    margin-top: 30px;
                    padding-top: 4px;
                    font-weight: bold;
                }
                .signature-img {
                    height: 25px;
                    object-fit: contain;
                    margin-bottom: -15px;
                }

                .footer-brand {
                    position: absolute;
                    bottom: 12px;
                    left: 30px;
                    right: 30px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 9px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 4px;
                }

                @media print {
                    body {
                        background: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .report-page-container {
                        padding: 0 !important;
                        background: white !important;
                    }
                    .report-card-sheet {
                        margin: 0 !important;
                        border: 4px double #b59410 !important;
                        box-shadow: none !important;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 8mm;
                    }
                }
            ` }} />

            <div className="report-page-container">
                {/* No-print Toolbar */}
                <div className="no-print max-w-[790px] mx-auto mb-4 flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/reports">
                            <ArrowLeft className="mr-2 size-4" /> Back to Reports
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/reports/${report.id}/edit`}>Edit Report</Link>
                        </Button>
                        <Button size="sm" onClick={handlePrint}>
                            <Printer className="mr-2 size-4" /> Print Progress Report
                        </Button>
                    </div>
                </div>

                {/* Progress Report Sheet */}
                <div className="report-card-sheet shadow-lg">
                    {/* Title Banner */}
                    <div className="report-title-section">
                        <h1>{school.name}</h1>
                        <p>{school.address}</p>
                    </div>

                    {/* Header Grid: Photo, Logo, Grade Scale */}
                    <div className="report-header-grid">
                        <div className="student-avatar-box" title="Student Profile Photo">
                            {/* Uses dynamic placeholder avatar if no image */}
                            <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>

                        <div className="report-badge-container">
                            <div className="report-badge-logo">
                                <span>e</span>
                            </div>
                            <div className="report-badge-text">Progress Report</div>
                        </div>

                        <div>
                            <table className="grade-scale-table">
                                <thead>
                                    <tr>
                                        <th>Range</th>
                                        <th>Grade</th>
                                        <th>GP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gradeScale.map((scale, i) => (
                                        <tr key={i}>
                                            <td>{scale.range}</td>
                                            <td>{scale.grade}</td>
                                            <td>{scale.gp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Student Info Details */}
                    <div className="student-info-grid">
                        <div>
                            <div className="info-row">
                                <span className="info-label">Name of Student</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">{report.student.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Father's Name</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">{report.student.guardian_name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Mother's Name</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">MOINA BEGUM</span> {/* Fallback or default */}
                            </div>
                            <div className="info-row">
                                <span className="info-label">Admission No</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">{report.student.student_id}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Roll No.</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">{report.student.roll_no}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Class</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">
                                    {report.student.class_name}-{report.student.section}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="info-row">
                                <span className="info-label">Exam</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">{report.exam_name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Year/Session</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">{report.academic_year}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Group</span>
                                <span className="info-colon">:</span>
                                <span className="info-value">COMMON</span>
                            </div>
                        </div>
                    </div>

                    {/* Marks Table */}
                    <table className="marks-table">
                        <thead>
                            <tr>
                                <th rowSpan={2} className="main-header">Name of Subjects</th>
                                <th rowSpan={2} className="main-header">Full Marks</th>
                                <th rowSpan={2} className="main-header">Highest Marks</th>
                                <th colSpan={4} className="main-header">Obtaining Marks</th>
                                <th rowSpan={2} className="main-header">Total Marks</th>
                                <th rowSpan={2} className="main-header">Letter Grade</th>
                                <th rowSpan={2} className="main-header">Grade Point</th>
                            </tr>
                            <tr>
                                <th>Written</th>
                                <th>MCQ</th>
                                <th>Practical</th>
                                <th>-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.marks.map((mark) => (
                                <tr key={mark.id}>
                                    <td className="subject-name">{mark.subject_name}</td>
                                    <td>{mark.full_marks}</td>
                                    <td>{mark.highest_marks}</td>
                                    <td>{mark.written_marks ?? '-'}</td>
                                    <td>{mark.mcq_marks ?? '-'}</td>
                                    <td>{mark.practical_marks ?? '-'}</td>
                                    <td>{mark.ca_marks ?? '-'}</td>
                                    <td className="font-bold">{mark.total_marks}</td>
                                    <td className="font-semibold">{mark.letter_grade}</td>
                                    <td className="font-semibold">{mark.grade_point.toFixed(2)}</td>
                                </tr>
                            ))}
                            {/* Highlighted Total Row */}
                            <tr className="total-row">
                                <td className="text-left">Total Exam Marks</td>
                                <td>{calculated.total_full_marks}</td>
                                <td colSpan={5} className="text-right pr-4 font-bold text-foreground">
                                    Obtained Marks & GPA
                                </td>
                                <td>{calculated.total_obtained_marks}</td>
                                <td>{calculated.grade}</td>
                                <td>{calculated.gpa.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Lower Section: Results, Behavior, Co-curricular, QR, Comments */}
                    <div className="lower-details-grid">
                        {/* Box 1: Results Summary */}
                        <table className="mini-table">
                            <tbody>
                                <tr>
                                    <td className="label-col">Result Status</td>
                                    <td className={`val-col ${calculated.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                                        {calculated.status}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-col">Class Position</td>
                                    <td className="val-col">{report.class_position ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label-col">GPA (Without 4th)</td>
                                    <td className="val-col">{calculated.gpa.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="label-col">Failed Subject(s)</td>
                                    <td className="val-col">{calculated.failed_count}</td>
                                </tr>
                                <tr>
                                    <td className="label-col">Working Days</td>
                                    <td className="val-col">{report.working_days || ''}</td>
                                </tr>
                                <tr>
                                    <td className="label-col">Total Present</td>
                                    <td className="val-col">{report.present_days || ''}</td>
                                </tr>
                                <tr>
                                    <td className="label-col">Total Absent</td>
                                    <td className="val-col">{report.absent_days || ''}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Box 2: Moral & Behavior */}
                        <div className="evaluation-box">
                            <h3>Moral & Behavior Evaluation</h3>
                            {moralGrades.map((grade) => {
                                const isActive = activeMoral.toLowerCase() === grade.toLowerCase();
                                return (
                                    <div key={grade} className={`checkbox-list-row ${isActive ? 'active' : ''}`}>
                                        <span>{grade}</span>
                                        <span className="checkbox-indicator">{isActive ? '✓' : ''}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Box 3: Co-Curricular */}
                        <div className="evaluation-box">
                            <h3>Co-Curricular Activities</h3>
                            {activities.map((act) => {
                                const isActive = activeActivities.some((item) => item.toLowerCase() === act.toLowerCase());
                                return (
                                    <div key={act} className={`checkbox-list-row ${isActive ? 'active' : ''}`}>
                                        <span>{act}</span>
                                        <span className="checkbox-indicator">{isActive ? '✓' : ''}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Box 4: Mock QR Code */}
                        <div className="qr-code-box" aria-label="QR Code">
                            <svg className="w-20 h-20 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                                {/* Border */}
                                <path d="M0 0h30v10H10v20H0V0zm70 0h30v30h-10V10H70V0zM0 70h10v20h20v10H0V70zm100 0v30H70v-10h20V70h10z" />
                                {/* Top-Left Finder Pattern */}
                                <path d="M5 5h20v20H5zm5 5v10h10V10z" />
                                <rect x="13" y="13" width="4" height="4" />
                                {/* Top-Right Finder Pattern */}
                                <path d="M75 5h20v20H75zm5 5v10h10V10z" />
                                <rect x="83" y="13" width="4" height="4" />
                                {/* Bottom-Left Finder Pattern */}
                                <path d="M5 75h20v20H5zm5 5v10h10V10z" />
                                <rect x="13" y="83" width="4" height="4" />
                                {/* Random QR Blocks */}
                                <rect x="35" y="15" width="8" height="8" />
                                <rect x="50" y="5" width="10" height="4" />
                                <rect x="45" y="25" width="5" height="15" />
                                <rect x="35" y="45" width="15" height="5" />
                                <rect x="55" y="35" width="10" height="10" />
                                <rect x="35" y="60" width="8" height="8" />
                                <rect x="50" y="60" width="15" height="4" />
                                <rect x="45" y="75" width="5" height="15" />
                                <rect x="35" y="85" width="15" height="5" />
                                <rect x="55" y="80" width="10" height="10" />
                                <rect x="75" y="35" width="15" height="5" />
                                <rect x="85" y="45" width="10" height="10" />
                                <rect x="75" y="60" width="8" height="8" />
                                <rect x="90" y="60" width="5" height="15" />
                            </svg>
                        </div>

                        {/* Comments Bar */}
                        <div className="comments-box">
                            <span>Comments:</span> <span className="font-normal text-muted-foreground italic">{report.comments || 'No comments recorded.'}</span>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="signature-section">
                        <div className="signature-block">
                            {/* Mock Signature Graphics */}
                            <svg className="signature-img text-blue-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M10 25c5-2 15-8 20-10s8 2 12-5 6-5 12 2 10 5 15 2c5-3 10-10 15-5" />
                                <path d="M25 20c10-5 25-10 35-12" strokeWidth="1" strokeDasharray="2 2" />
                            </svg>
                            <div className="signature-line">Exam Controller</div>
                        </div>
                        <div className="signature-block">
                            <svg className="signature-img text-slate-800" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M15 15c8-5 18 2 25-8s10-5 18 4 12-3 15-5c10 5 12 10 15 12" />
                            </svg>
                            <div className="signature-line">Principal</div>
                        </div>
                    </div>

                    {/* Footer brand / credits */}
                    <div className="footer-brand">
                        <span>{school.footer}</span>
                        <span>Date of Publication of Results: 29-Jun-26</span>
                    </div>
                </div>
            </div>
        </>
    );
}

ReportsShow.layout = {
    breadcrumbs: [
        { title: 'Reports', href: '/reports' },
        { title: 'Progress Report', href: '' }
    ],
};
