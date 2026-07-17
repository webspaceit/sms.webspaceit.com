import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StudentMerit = {
    id: number;
    student_id: string;
    roll_no: number;
    name: string;
    total_marks: number;
    gpa: string;
    grade: string;
    merit: number;
};

type MeritList = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
};

type MeritListsShowProps = {
    meritList: MeritList;
    students: StudentMerit[];
    school: {
        name: string;
        address: string;
    };
    generatedDate: string;
};

export default function MeritListsShow({ meritList, students, school, generatedDate }: MeritListsShowProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Merit List - ${meritList.class_name} (${meritList.section})`} />

            {/* Scoped CSS for print layouts */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .merit-container {
                    background-color: #f5f5f5;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                }
                .merit-sheet {
                    background: white;
                    width: 1000px;
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
                }

                .school-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 12px;
                }
                .school-logo-circle {
                    width: 50px;
                    height: 50px;
                    background: #0f4c81;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 22px;
                }
                .school-meta h1 {
                    font-size: 22px;
                    font-weight: 700;
                    color: #0b2240;
                    margin: 0;
                    line-height: 1.2;
                }
                .school-meta p {
                    font-size: 11px;
                    color: #555;
                    margin: 2px 0 0 0;
                }

                .banner-title {
                    border-top: 1px solid #111;
                    border-bottom: 1px solid #111;
                    text-align: center;
                    padding: 4px 0;
                    font-weight: 700;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 15px;
                    background: #fdfdfd;
                }

                .metadata-bar {
                    display: grid;
                    grid-template-cols: 80px 1.5fr 80px 1.5fr 110px 1fr;
                    border: 1px solid #111;
                    font-size: 11px;
                    margin-bottom: 20px;
                }
                .metadata-label {
                    background: #f5f5f5;
                    border-right: 1px solid #111;
                    padding: 6px 8px;
                    font-weight: bold;
                }
                .metadata-val {
                    padding: 6px 10px;
                    font-weight: bold;
                    border-right: 1px solid #111;
                    text-transform: uppercase;
                }
                .metadata-val:last-child {
                    border-right: none;
                }

                .merit-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                    margin-bottom: 20px;
                }
                .merit-table th, .merit-table td {
                    border: 1px solid #111;
                    padding: 6px 10px;
                    vertical-align: middle;
                }
                .merit-table th {
                    background: #ebf5eb;
                    font-weight: bold;
                }
                .merit-table td.text-center {
                    text-align: center;
                }
                .merit-table td.font-semibold {
                    font-weight: 600;
                }

                .summary-row {
                    display: flex;
                    justify-content: flex-end;
                    font-weight: bold;
                    font-size: 12px;
                    margin-top: 10px;
                    margin-bottom: 50px;
                }

                .merit-footer {
                    position: absolute;
                    bottom: 20px;
                    left: 30px;
                    right: 30px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #555;
                    border-top: 1px solid #ddd;
                    padding-top: 6px;
                }

                @media print {
                    body {
                        background: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .merit-container {
                        padding: 0 !important;
                        background: white !important;
                    }
                    .merit-sheet {
                        margin: 0 !important;
                        box-shadow: none !important;
                        width: 100% !important;
                        min-height: auto !important;
                        border: 4px double #b59410 !important;
                    }
                    @page {
                        size: landscape;
                        margin: 8mm;
                    }
                }
            ` }} />

            <div className="merit-container">
                {/* Floating control bar */}
                <div className="no-print max-w-5xl mx-auto mb-4 flex justify-between items-center bg-card p-3 rounded-lg border shadow-sm">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/merit-lists">
                            <ArrowLeft className="mr-2 size-4" /> Back to List
                        </Link>
                    </Button>
                    <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="size-4" /> Print Merit List
                    </Button>
                </div>

                <div className="merit-sheet">
                    {/* Header */}
                    <header className="school-header">
                        <div className="school-logo-circle">e</div>
                        <div className="school-meta">
                            <h1>{school.name}</h1>
                            <p>{school.address}</p>
                        </div>
                    </header>

                    {/* Banner Title */}
                    <div className="banner-title">
                        Section Wise Merit List
                    </div>

                    {/* Metadata Bar */}
                    <div className="metadata-bar">
                        <div className="metadata-label">Section:</div>
                        <div className="metadata-val">{meritList.class_name}-{meritList.section}</div>
                        <div className="metadata-label">Exam:</div>
                        <div className="metadata-val">{meritList.exam_name}</div>
                        <div className="metadata-label">Academic Year:</div>
                        <div className="metadata-val">{meritList.academic_year}</div>
                    </div>

                    {/* Merit Table */}
                    <table className="merit-table">
                        <thead>
                            <tr>
                                <th style={{ width: '120px' }}>Admission No</th>
                                <th style={{ width: '80px' }} className="text-center">Roll No.</th>
                                <th style={{ width: '220px' }}>Name</th>
                                <th style={{ width: '110px' }} className="text-center">Total Marks</th>
                                <th style={{ width: '110px' }} className="text-center">Section Merit</th>
                                <th style={{ width: '100px' }} className="text-center">Grade</th>
                                <th style={{ width: '100px' }} className="text-center">GPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground font-medium">
                                        No passing students found for this class, section and exam.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.student_id}>
                                        <td>{student.student_id}</td>
                                        <td className="text-center font-semibold">{student.roll_no}</td>
                                        <td className="font-semibold text-foreground uppercase">{student.name}</td>
                                        <td className="text-center font-semibold">{student.total_marks}</td>
                                        <td className="text-center font-bold text-slate-800">{student.merit}</td>
                                        <td className="text-center font-semibold">{student.grade}</td>
                                        <td className="text-center font-semibold">{student.gpa}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Summary row */}
                    <div className="summary-row">
                        Total Student: {students.length}
                    </div>

                    {/* Footer */}
                    <footer className="merit-footer">
                        <div>{school.footer}</div>
                        <div>Page 1 of 1</div>
                        <div>Date: {generatedDate}</div>
                    </footer>
                </div>
            </div>
        </>
    );
}
