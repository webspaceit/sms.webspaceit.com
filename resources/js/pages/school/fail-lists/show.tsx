import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FailedStudent = {
    student_id: string;
    roll_no: number;
    name: string;
    failed_subjects_count: number;
    failed_subjects_list: string;
};

type FailList = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
};

type FailListsShowProps = {
    failList: FailList;
    failedStudents: FailedStudent[];
    school: {
        name: string;
        address: string;
    };
    generatedDate: string;
};

export default function FailListsShow({ failList, failedStudents, school, generatedDate }: FailListsShowProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Fail List - ${failList.class_name} (${failList.section})`} />

            {/* Print style overrides */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .fail-list-container {
                    background-color: #f5f5f5;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                }
                .fail-list-sheet {
                    background: white;
                    width: 1000px;
                    min-height: 1414px; /* A4 landscape ratio or standard portrait depending on data */
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

                .failed-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10.5px;
                    margin-bottom: 40px;
                }
                .failed-table th, .failed-table td {
                    border: 1px solid #111;
                    padding: 6px 8px;
                    vertical-align: middle;
                }
                .failed-table th {
                    background: #ebf5eb;
                    font-weight: bold;
                    text-align: left;
                }
                .failed-table td.text-center {
                    text-align: center;
                }
                .failed-table td.subjects-cell {
                    line-height: 1.4;
                    color: #333;
                }

                .fail-list-footer {
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
                    .fail-list-container {
                        padding: 0 !important;
                        background: white !important;
                    }
                    .fail-list-sheet {
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

            <div className="fail-list-container">
                {/* Floating control bar */}
                <div className="no-print max-w-5xl mx-auto mb-4 flex justify-between items-center bg-card p-3 rounded-lg border shadow-sm">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/fail-lists">
                            <ArrowLeft className="mr-2 size-4" /> Back to List
                        </Link>
                    </Button>
                    <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="size-4" /> Print Summary Report
                    </Button>
                </div>

                <div className="fail-list-sheet">
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
                        Fail List- Summary
                    </div>

                    {/* Metadata Bar */}
                    <div className="metadata-bar">
                        <div className="metadata-label">Section:</div>
                        <div className="metadata-val">{failList.class_name}-{failList.section}</div>
                        <div className="metadata-label">Exam:</div>
                        <div className="metadata-val">{failList.exam_name}</div>
                        <div className="metadata-label">Academic Year:</div>
                        <div className="metadata-val">{failList.academic_year}</div>
                    </div>

                    {/* Results Table */}
                    <table className="failed-table">
                        <thead>
                            <tr>
                                <th style={{ width: '90px' }}>Admission No</th>
                                <th style={{ width: '60px' }} className="text-center">Roll No.</th>
                                <th style={{ width: '180px' }}>Name</th>
                                <th style={{ width: '80px' }} className="text-center">No. of Failed Subjects</th>
                                <th>Failed Subjects</th>
                            </tr>
                        </thead>
                        <tbody>
                            {failedStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-medium">
                                        No student failures recorded for this group and exam.
                                    </td>
                                </tr>
                            ) : (
                                failedStudents.map((student) => (
                                    <tr key={student.student_id}>
                                        <td>{student.student_id}</td>
                                        <td className="text-center font-semibold">{student.roll_no}</td>
                                        <td className="font-semibold text-foreground uppercase">{student.name}</td>
                                        <td className="text-center font-semibold text-red-600 bg-red-50">{student.failed_subjects_count}</td>
                                        <td className="subjects-cell font-mono text-[10px]">{student.failed_subjects_list}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <footer className="fail-list-footer">
                        <div>{school.footer}</div>
                        <div>Page 1 of 1</div>
                        <div>Date: {generatedDate}</div>
                    </footer>
                </div>
            </div>
        </>
    );
}
