import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type SubjectMark = {
    written: number | null;
    mcq: number | null;
    practical: number | null;
    ca: number | null;
    total: number;
    grade: string;
    gp: number;
};

type StudentData = {
    id: number;
    student_id: string;
    name: string;
    roll_no: number;
    total_marks: number;
    gpa: number;
    grade: string;
    status: string;
    failed_count: number;
    merit: number | string;
    marks_list: Array<{
        id: number;
        subject_name: string;
        full_marks: number;
        highest_marks: number;
        written_marks: number | null;
        mcq_marks: number | null;
        practical_marks: number | null;
        ca_marks: number | null;
        total_marks: number;
        letter_grade: string;
        grade_point: number;
    }>;
    itemized_marks: Record<string, SubjectMark | null>;
};

type TabulationSheet = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
};

type TabulationSheetsShowProps = {
    tabulationSheet: TabulationSheet;
    students: StudentData[];
    subjects: string[];
    summary: {
        total_students: number;
        exam_participants: number;
        total_pass: number;
        total_fail: number;
        pass_rate: number;
    };
    school: {
        name: string;
        address: string;
    };
    generatedDate: string;
};

export default function TabulationSheetsShow({ tabulationSheet, students, subjects, summary, school, generatedDate }: TabulationSheetsShowProps) {
    const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal');

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Tabulation Sheet - ${tabulationSheet.class_name} (${tabulationSheet.section})`} />

            {/* Scoped CSS for the tabulation sheet print layout */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .tabulation-container {
                    background-color: #f5f5f5;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                }
                .tabulation-sheet {
                    background: white;
                    width: ${viewMode === 'horizontal' ? '1200px' : '900px'};
                    min-height: 1414px;
                    margin: 0 auto;
                    padding: 30px;
                    box-sizing: border-box;
                    font-family: 'Instrument Sans', 'Arial', sans-serif;
                    color: #111;
                    border: 4px double #b59410;
                    outline: 1px solid #111;
                    outline-offset: -3px;
                    position: relative;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: width 0.3s ease;
                }

                .school-header {
                    text-align: center;
                    margin-bottom: 12px;
                }
                .school-header h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0b2240;
                    margin: 0;
                    line-height: 1.2;
                    text-transform: uppercase;
                }
                .school-header p {
                    font-size: 11px;
                    color: #555;
                    margin: 3px 0 0 0;
                }

                .banner-title {
                    border-top: 1px solid #111;
                    border-bottom: 1px solid #111;
                    text-align: center;
                    padding: 4px 0;
                    font-weight: 700;
                    font-size: 15px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    background: #fcfcfc;
                }

                /* Metadata Grid Style (Horizontal) */
                .metadata-grid-horizontal {
                    display: grid;
                    grid-template-cols: repeat(10, 1fr);
                    border: 1px solid #111;
                    font-size: 10px;
                    margin-bottom: 15px;
                    text-align: center;
                }
                .metadata-grid-horizontal > div {
                    border-right: 1px solid #111;
                }
                .metadata-grid-horizontal > div:last-child {
                    border-right: none;
                }
                .meta-header {
                    background: #f0f0f0;
                    font-weight: bold;
                    border-bottom: 1px solid #111;
                    padding: 4px;
                }
                .meta-value {
                    font-weight: bold;
                    padding: 4px;
                }

                /* Table style */
                .tabulation-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                    margin-bottom: 50px;
                }
                .tabulation-table th, .tabulation-table td {
                    border: 1px solid #111;
                    padding: 4px 5px;
                    vertical-align: middle;
                }
                .tabulation-table th {
                    background: #ebf5eb;
                    font-weight: bold;
                    text-align: center;
                }
                .tabulation-table td.text-center {
                    text-align: center;
                }
                .tabulation-table td.font-semibold {
                    font-weight: 600;
                }

                /* Vertical card style */
                .vertical-student-card {
                    border: 1px solid #111;
                    margin-bottom: 25px;
                    page-break-inside: avoid;
                }
                .card-header-bar {
                    background: #ebf5eb;
                    border-bottom: 1px solid #111;
                    padding: 6px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 11px;
                }
                .card-student-info {
                    font-weight: bold;
                    color: #0b2240;
                }
                .card-stats-info {
                    display: flex;
                    gap: 15px;
                    font-weight: bold;
                }
                .vertical-card-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                }
                .vertical-card-table th, .vertical-card-table td {
                    border: 1px solid #ddd;
                    border-left: none;
                    border-right: none;
                    padding: 5px 12px;
                    text-align: left;
                }
                .vertical-card-table th {
                    background: #fafafa;
                    font-weight: 600;
                    border-bottom: 1px solid #111;
                }
                .vertical-card-table tr:last-child td {
                    border-bottom: none;
                }

                .tabulation-footer {
                    position: absolute;
                    bottom: 20px;
                    left: 30px;
                    right: 30px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 9px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 5px;
                }

                @media print {
                    body {
                        background: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .tabulation-container {
                        padding: 0 !important;
                        background: white !important;
                    }
                    .tabulation-sheet {
                        margin: 0 !important;
                        box-shadow: none !important;
                        width: 100% !important;
                        min-height: auto !important;
                        border: 4px double #b59410 !important;
                        padding: 20px !important;
                    }
                    @page {
                        size: ${viewMode === 'horizontal' ? 'landscape' : 'portrait'};
                        margin: 8mm;
                    }
                }
            ` }} />

            <div className="tabulation-container">
                {/* Floating control bar */}
                <div className="no-print max-w-5xl mx-auto mb-4 flex justify-between items-center bg-card p-3 rounded-lg border shadow-sm">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/tabulation-sheets">
                                <ArrowLeft className="mr-2 size-4" /> Back to List
                            </Link>
                        </Button>
                        <div className="h-8 w-px bg-border mx-1" />
                        <Button
                            variant={viewMode === 'horizontal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('horizontal')}
                            className="flex items-center gap-1.5"
                        >
                            <LayoutGrid className="size-4" /> Horizontal Grid
                        </Button>
                        <Button
                            variant={viewMode === 'vertical' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('vertical')}
                            className="flex items-center gap-1.5"
                        >
                            <List className="size-4" /> Vertical Cards
                        </Button>
                    </div>

                    <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="size-4" /> Print Tabulation Sheet
                    </Button>
                </div>

                <div className="tabulation-sheet">
                    {/* Header */}
                    <header className="school-header">
                        <h1>{school.name}</h1>
                        <p>{school.address}</p>
                    </header>

                    {/* Banner Title */}
                    <div className="banner-title">
                        Tabulation Sheet
                    </div>

                    {/* Horizontal View Mode Layout */}
                    {viewMode === 'horizontal' ? (
                        <>
                            {/* Metadata Grid */}
                            <div className="metadata-grid-horizontal">
                                <div>
                                    <div className="meta-header">Academic Year</div>
                                    <div className="meta-value">{tabulationSheet.academic_year}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Class</div>
                                    <div className="meta-value">{tabulationSheet.class_name}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Shift</div>
                                    <div className="meta-value">Common</div>
                                </div>
                                <div>
                                    <div className="meta-header">Section</div>
                                    <div className="meta-value">{tabulationSheet.section}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Exam</div>
                                    <div className="meta-value">{tabulationSheet.exam_name}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Total Students</div>
                                    <div className="meta-value">{summary.total_students}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Exam Participants</div>
                                    <div className="meta-value">{summary.exam_participants}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Total Pass</div>
                                    <div className="meta-value">{summary.total_pass}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Total Fail</div>
                                    <div className="meta-value">{summary.total_fail}</div>
                                </div>
                                <div>
                                    <div className="meta-header">Pass %</div>
                                    <div className="meta-value">{summary.pass_rate}%</div>
                                </div>
                            </div>

                            {/* Horizontal Grid Table */}
                            <table className="tabulation-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '80px' }}>ID</th>
                                        <th style={{ width: '130px' }}>Name</th>
                                        <th style={{ width: '50px' }} className="text-center">Roll No.</th>
                                        {subjects.map((sub) => (
                                            <th key={sub} className="text-center">{sub}</th>
                                        ))}
                                        <th style={{ width: '60px' }} className="text-center">Total</th>
                                        <th style={{ width: '60px' }} className="text-center">Merit Pos.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={3 + subjects.length + 2} className="px-4 py-8 text-center text-muted-foreground font-medium">
                                                No student reports found for this group and exam.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.student_id}>
                                                <td className="font-medium">{student.student_id}</td>
                                                <td className="font-semibold uppercase text-foreground truncate max-w-[130px]" title={student.name}>
                                                    {student.name}
                                                </td>
                                                <td className="text-center font-semibold">{student.roll_no}</td>
                                                {subjects.map((sub) => {
                                                    const m = student.itemized_marks[sub];
                                                    return (
                                                        <td key={sub} className="text-center">
                                                            {m ? m.total : '-'}
                                                        </td>
                                                    );
                                                })}
                                                <td className="text-center font-bold">{student.total_marks}</td>
                                                <td className="text-center font-bold text-slate-800">{student.merit}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        /* Vertical Cards Mode Layout */
                        <div className="space-y-6 pb-12">
                            {/* Metadata Summary Banner */}
                            <div className="grid grid-cols-4 gap-4 border p-3 bg-slate-50 text-xs font-semibold mb-6">
                                <div>Class: <span className="text-slate-900">{tabulationSheet.class_name} ({tabulationSheet.section})</span></div>
                                <div>Exam: <span className="text-slate-900">{tabulationSheet.exam_name}</span></div>
                                <div>Academic Year: <span className="text-slate-900">{tabulationSheet.academic_year}</span></div>
                                <div>Passing Rate: <span className="text-slate-900">{summary.pass_rate}% ({summary.total_pass} of {summary.exam_participants})</span></div>
                            </div>

                            {students.length === 0 ? (
                                <div className="border border-dashed p-8 text-center text-muted-foreground font-medium rounded-lg">
                                    No student reports found for this class and exam.
                                </div>
                            ) : (
                                students.map((student) => (
                                    <div key={student.student_id} className="vertical-student-card">
                                        {/* Card Header Bar */}
                                        <div className="card-header-bar">
                                            <div className="card-student-info">
                                                Name: {student.name} &nbsp;·&nbsp; Roll No: {student.roll_no} &nbsp;·&nbsp; Admission No: {student.student_id}
                                            </div>
                                            <div className="card-stats-info">
                                                <span>Merit: {student.merit}</span>
                                                <span>Total Marks: {student.total_marks}</span>
                                                <span>GPA: {student.status === 'Failed' ? '0.00' : student.gpa.toFixed(2)}</span>
                                                <span>Grade: {student.grade}</span>
                                            </div>
                                        </div>

                                        {/* Card Marks Table */}
                                        <table className="vertical-card-table">
                                            <thead>
                                                <tr>
                                                    <th>Name of Subjects</th>
                                                    <th className="text-center" style={{ width: '80px' }}>Written</th>
                                                    <th className="text-center" style={{ width: '80px' }}>MCQ</th>
                                                    <th className="text-center" style={{ width: '80px' }}>Practical</th>
                                                    <th className="text-center" style={{ width: '80px' }}>CA</th>
                                                    <th className="text-center" style={{ width: '80px' }}>Total</th>
                                                    <th className="text-center" style={{ width: '80px' }}>Letter</th>
                                                    <th className="text-center" style={{ width: '80px' }}>Grade Point</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {student.marks_list.map((mark) => (
                                                    <tr key={mark.id}>
                                                        <td className="font-semibold text-slate-800">{mark.subject_name}</td>
                                                        <td className="text-center">{mark.written_marks ?? '-'}</td>
                                                        <td className="text-center">{mark.mcq_marks ?? '-'}</td>
                                                        <td className="text-center">{mark.practical_marks ?? '-'}</td>
                                                        <td className="text-center">{mark.ca_marks ?? '-'}</td>
                                                        <td className="text-center font-bold text-slate-900">{mark.total_marks}</td>
                                                        <td className="text-center font-semibold">{mark.letter_grade}</td>
                                                        <td className="text-center font-semibold">{mark.grade_point.toFixed(1)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <footer className="tabulation-footer">
                        <div>{school.footer}</div>
                        <div>Page 1 of 1</div>
                        <div>Date: {generatedDate}</div>
                    </footer>
                </div>
            </div>
        </>
    );
}
