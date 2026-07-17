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
    guardian_phone: string;
};

type AdmitCardConfig = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
    start_time: string;
    instructions: string[] | null;
    routine: Record<string, string> | null;
};

type AdmitCardsShowProps = {
    admitCard: AdmitCardConfig;
    students: Student[];
    school: {
        name: string;
        address: string;
    };
    generatedDate: string;
};

// Simple Mock QR Code SVG component to look premium and authentic
function MockQRCode({ data }: { data: string }) {
    // Generate a pseudo-random block pattern based on the student ID
    const seed = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const size = 15; // 15x15 matrix
    const blocks: boolean[][] = [];

    // Setup standard QR borders
    for (let r = 0; r < size; r++) {
        blocks[r] = [];
        for (let c = 0; c < size; c++) {
            // Position detection patterns (corners)
            const isTopLeft = r < 5 && c < 5;
            const isTopRight = r < 5 && c >= size - 5;
            const isBottomLeft = r >= size - 5 && c < 5;

            if (isTopLeft || isTopRight || isBottomLeft) {
                // Outer ring
                const outerRing = r === 0 || r === 4 || c === 0 || c === 4 ||
                    (r === 0 && c >= size - 5) || (r === 4 && c >= size - 5) ||
                    (c === size - 5 && r < 5) || (c === size - 1 && r < 5) ||
                    (r === size - 5 && c < 5) || (r === size - 1 && c < 5) ||
                    (c === 0 && r >= size - 5) || (c === 4 && r >= size - 5);
                const innerDot = (r === 2 && c === 2) ||
                    (r === 2 && c === size - 3) ||
                    (r === size - 3 && c === 2);
                blocks[r][c] = outerRing || innerDot;
            } else {
                // Pseudo-random noise based on seed
                const val = Math.sin(seed + r * 17 + c * 31);
                blocks[r][c] = val > 0.1;
            }
        }
    }

    return (
        <svg viewBox="0 0 100 100" className="size-16 border p-1 bg-white rounded shadow-sm">
            {blocks.map((row, r) =>
                row.map((active, c) =>
                    active ? (
                        <rect
                            key={`${r}-${c}`}
                            x={(c * 100) / size}
                            y={(r * 100) / size}
                            width={100 / size}
                            height={100 / size}
                            fill="black"
                        />
                    ) : null
                )
            )}
        </svg>
    );
}

export default function AdmitCardsShow({ admitCard, students, school, generatedDate }: AdmitCardsShowProps) {
    const handlePrint = () => {
        window.print();
    };

    // Format routine items into side-by-side array pairs to match reference image layout
    const routineList = admitCard.routine ? Object.entries(admitCard.routine) : [];
    const midPoint = Math.ceil(routineList.length / 2);
    const leftRoutine = routineList.slice(0, midPoint);
    const rightRoutine = routineList.slice(midPoint);

    // Padding routine list to have matching rows on both sides
    const maxRows = Math.max(leftRoutine.length, rightRoutine.length);
    const formattedRoutine: { left: [string, string] | null; right: [string, string] | null }[] = [];
    for (let i = 0; i < maxRows; i++) {
        formattedRoutine.push({
            left: leftRoutine[i] ?? null,
            right: rightRoutine[i] ?? null,
        });
    }

    // Class group helper
    const getStudentGroup = (studentClass: string, section: string) => {
        const lower = section.toLowerCase();
        if (lower.includes('science')) return 'SCIENCE';
        if (lower.includes('commerce') || lower.includes('business')) return 'COMMERCE';
        if (lower.includes('humanities') || lower.includes('arts')) return 'HUMANITIES';
        return 'COMMON';
    };

    return (
        <>
            <Head title={`Print Admit Cards - ${admitCard.class_name} (${admitCard.section})`} />

            {/* Print settings stylesheet */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .admit-card-view-container {
                    background-color: #f1f5f9;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                }
                .admit-card-wrapper {
                    background: white;
                    width: 790px;
                    margin: 0 auto 30px auto;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    border: 4px double #1e3a8a;
                    padding: 20px;
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                .admit-card-bg-curve {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 180px;
                    background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);
                    clip-path: ellipse(70% 60% at 50% 0%);
                    z-index: 1;
                }
                .admit-card-content {
                    position: relative;
                    z-index: 2;
                }
                @media print {
                    body {
                        background-color: white !important;
                    }
                    .admit-card-view-container {
                        padding: 0 !important;
                        background: transparent !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .admit-card-wrapper {
                        margin: 0 !important;
                        box-shadow: none !important;
                        page-break-after: always;
                    }
                }
            `}} />

            <div className="admit-card-view-container">
                {/* Floating Action Header (Hidden in Print) */}
                <div className="no-print max-w-[790px] mx-auto mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="size-8" asChild>
                            <Link href="/admit-cards">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-md font-semibold text-slate-800">Print Admit Cards</h1>
                            <p className="text-xs text-muted-foreground">Generating {students.length} admit cards for {admitCard.class_name} ({admitCard.section})</p>
                        </div>
                    </div>
                    <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                        <Printer className="mr-2 size-4" /> Print All Cards
                    </Button>
                </div>

                {/* Admit Cards List */}
                {students.length === 0 ? (
                    <div className="max-w-[790px] mx-auto text-center p-12 bg-white rounded-lg border text-muted-foreground shadow-sm">
                        No students found in {admitCard.class_name} ({admitCard.section}) to generate cards for.
                    </div>
                ) : (
                    students.map((student) => {
                        const group = getStudentGroup(student.class_name, student.section);

                        return (
                            <div key={student.id} className="admit-card-wrapper">
                                <div className="admit-card-bg-curve"></div>
                                <div className="admit-card-content space-y-5">

                                    {/* Header Section */}
                                    <div className="flex items-start justify-between border-b border-emerald-200 pb-3">
                                        <div className="flex items-center gap-3">
                                            {/* Graduation hat icon representation */}
                                            <div className="size-16 bg-blue-900 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md relative overflow-hidden">
                                                <span className="text-3xl font-extrabold select-none">e</span>
                                                <div className="absolute top-1.5 left-2 right-2 border-t-2 border-white opacity-40"></div>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-blue-950 uppercase tracking-tight">{school.name}</h2>
                                                <p className="text-xs text-slate-700 font-medium">{school.address}</p>
                                            </div>
                                        </div>

                                        {/* Dynamic Student Image and QR Code Block */}
                                        <div className="flex items-center gap-3">
                                            <MockQRCode data={student.student_id} />
                                            {/* Photo Box */}
                                            <div className="size-16 border bg-slate-100 rounded overflow-hidden shadow-sm flex items-center justify-center relative border-slate-300">
                                                <svg className="size-10 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                                                </svg>
                                                <span className="absolute bottom-0 text-[8px] bg-slate-700 text-white w-full text-center py-0.5 opacity-90">PHOTO</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title Banner */}
                                    <div className="flex justify-center my-1.5">
                                        <div className="bg-blue-900 text-white px-8 py-1 rounded-full text-md font-bold tracking-widest shadow-md">
                                            Admit Card
                                        </div>
                                    </div>

                                    {/* Student Info Grid */}
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px] text-slate-800">
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Name</span>
                                            <span>:</span>
                                            <span className="font-bold text-slate-900 uppercase">{student.name}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Exam Name</span>
                                            <span>:</span>
                                            <span className="font-bold text-blue-900">{admitCard.exam_name}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Admission No</span>
                                            <span>:</span>
                                            <span className="font-semibold text-slate-900">{student.student_id}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Year/Session</span>
                                            <span>:</span>
                                            <span className="font-semibold text-slate-900">{admitCard.academic_year}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Roll No.</span>
                                            <span>:</span>
                                            <span className="font-bold text-slate-900">{student.roll_no}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Registration No.</span>
                                            <span>:</span>
                                            <span className="text-slate-950 font-semibold">N/A</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Group</span>
                                            <span>:</span>
                                            <span className="font-semibold text-slate-900">{group}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr]">
                                            <span className="font-semibold text-slate-700">Mobile No.</span>
                                            <span>:</span>
                                            <span className="font-semibold text-slate-900">{student.guardian_phone}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_5px_1fr] col-span-2">
                                            <span className="font-semibold text-slate-700">Section</span>
                                            <span>:</span>
                                            <span className="font-semibold text-slate-900">{admitCard.class_name}-{admitCard.section}-Common</span>
                                        </div>
                                    </div>

                                    {/* Exam Routine Table */}
                                    <div className="border border-slate-300 rounded overflow-hidden">
                                        <div className="bg-blue-900 text-white text-center py-1 font-bold text-xs">
                                            Exam Routine (Exam Start Time: {admitCard.start_time})
                                        </div>
                                        <table className="w-full text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-slate-100 border-b border-slate-300">
                                                    <th className="border-r border-slate-300 py-1.5 px-3 text-left w-1/4 text-slate-700">Date</th>
                                                    <th className="border-r border-slate-300 py-1.5 px-3 text-left w-1/4 text-slate-700">Subject</th>
                                                    <th className="border-r border-slate-300 py-1.5 px-3 text-left w-1/4 text-slate-700">Date</th>
                                                    <th className="py-1.5 px-3 text-left w-1/4 text-slate-700">Subject</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formattedRoutine.map((row, index) => (
                                                    <tr key={index} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50 transition-colors">
                                                        <td className="border-r border-slate-300 py-1.5 px-3 font-semibold text-slate-800">
                                                            {row.left ? row.left[1] : '-'}
                                                        </td>
                                                        <td className="border-r border-slate-300 py-1.5 px-3 text-slate-900">
                                                            {row.left ? row.left[0] : '-'}
                                                        </td>
                                                        <td className="border-r border-slate-300 py-1.5 px-3 font-semibold text-slate-800">
                                                            {row.right ? row.right[1] : '-'}
                                                        </td>
                                                        <td className="py-1.5 px-3 text-slate-900">
                                                            {row.right ? row.right[0] : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Instructions Box */}
                                    <div className="border border-slate-300 rounded overflow-hidden text-xs">
                                        <div className="bg-blue-900 text-white inline-block px-4 py-0.5 font-bold rounded-br">
                                            Instructions
                                        </div>
                                        <ol className="p-3 list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
                                            {admitCard.instructions?.map((inst, index) => (
                                                <li key={index}>{inst}</li>
                                            )) ?? <li>Examinees must follow general exam policies.</li>}
                                        </ol>
                                    </div>

                                    {/* Signatures & Footer Row */}
                                    <div className="pt-8 flex items-end justify-between text-xs">
                                        <div className="text-[9px] text-slate-400 self-end italic">
                                            {school.footer}
                                        </div>

                                        <div className="flex gap-16">
                                            {/* Class Teacher Signature */}
                                            <div className="text-center w-28">
                                                <div className="h-6 font-cursive text-slate-600 text-md tracking-wider select-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                                    I. Biswas
                                                </div>
                                                <div className="border-t border-slate-400 border-dotted pt-1 text-slate-600 font-semibold">
                                                    Class Teacher
                                                </div>
                                            </div>

                                            {/* Principal Signature */}
                                            <div className="text-center w-28">
                                                <div className="h-6 font-cursive text-slate-600 text-md tracking-wider select-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                                    S. Rahman
                                                </div>
                                                <div className="border-t border-slate-400 border-dotted pt-1 text-slate-600 font-semibold">
                                                    Principal
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
