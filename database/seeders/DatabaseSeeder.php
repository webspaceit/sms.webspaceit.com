<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(BangladeshSchoolDataSeeder::class);
        $this->call(PermissionSeeder::class);

        $demoUsers = [
            ['superadmin@school.test', 'Super Admin',  'password', 'superadmin'],
            ['admin@school.test',      'Head Teacher', 'password', 'admin'],
            ['teacher@school.test',    'Teacher',      'password', 'teacher'],
            ['accountant@school.test', 'Accountant',   'password', 'accountant'],
            ['receptionist@school.test','Receptionist','password', 'receptionist'],
            ['librarian@school.test',  'Librarian',    'password', 'librarian'],
        ];

        foreach ($demoUsers as [$email, $name, $pw, $role]) {
            User::query()->updateOrCreate(compact('email'), [
                'name' => $name,
                'password' => $pw,
                'role' => $role,
                'email_verified_at' => now(),
            ]);
        }

        $students = [
            ['STU-2026-001', 'Ayesha Rahman', 'Class 6', 'A', 1, '2014-02-12', 'Female', 'Md. Kamal Rahman', '01711000001', 'Dhaka', 'Bashabo, Dhaka', 'O+'],
            ['STU-2026-002', 'Tanvir Hasan', 'Class 6', 'A', 2, '2014-06-24', 'Male', 'Nasima Begum', '01812000002', 'Narayanganj', 'Fatullah, Narayanganj', 'A+'],
            ['STU-2026-003', 'Nusrat Jahan', 'Class 7', 'B', 4, '2013-01-15', 'Female', 'Abdul Matin', '01913000003', 'Chattogram', 'Panchlaish, Chattogram', 'B+'],
            ['STU-2026-004', 'Sakib Ahmed', 'Class 8', 'A', 7, '2012-09-03', 'Male', 'Rokeya Akter', '01614000004', 'Sylhet', 'Zindabazar, Sylhet', 'AB+'],
            ['STU-2026-005', 'Maliha Islam', 'Class 9', 'Science', 3, '2011-04-18', 'Female', 'Mahbubul Islam', '01715000005', 'Rajshahi', 'Shaheb Bazar, Rajshahi', 'O-'],
            ['STU-2026-006', 'Rafiul Karim', 'Class 10', 'Commerce', 5, '2010-11-08', 'Male', 'Farhana Karim', '01816000006', 'Khulna', 'Sonadanga, Khulna', 'A-'],
            ['STU-2026-007', 'Jannatul Mawa', 'SSC Batch', 'Science', 9, '2010-03-21', 'Female', 'Md. Salim Uddin', '01917000007', 'Barishal', 'Nathullabad, Barishal', 'B-'],
            ['STU-2026-008', 'Fahim Chowdhury', 'HSC 1st Year', 'Humanities', 11, '2008-12-01', 'Male', 'Shirin Akter', '01518000008', 'Rangpur', 'Jahaj Company Mor, Rangpur', 'AB-'],
        ];

        foreach ($students as $i => $student) {
            $numericLevel = null;
            if (preg_match('/^Class (\d+)$/', $student[2], $m)) {
                $numericLevel = (int) $m[1];
            }
            $class = $numericLevel ? DB::table('classes')->where('name', "Class {$numericLevel}")->first() : null;
            $studentEmail = 'student' . ($i + 1) . '@school.test';

            DB::table('students')->updateOrInsert(['student_id' => $student[0]], [
                'name' => $student[1],
                'class_name' => $student[2],
                'class_id' => $class?->id,
                'section' => $student[3],
                'roll_no' => $student[4],
                'date_of_birth' => $student[5],
                'gender' => $student[6],
                'guardian_name' => $student[7],
                'guardian_phone' => $student[8],
                'district' => $student[9],
                'address' => $student[10],
                'blood_group' => $student[11],
                'email' => $studentEmail,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            User::query()->updateOrCreate(['email' => $studentEmail], [
                'name' => $student[1],
                'password' => 'password',
                'role' => 'student',
                'email_verified_at' => now(),
            ]);
        }

        $parentEmails = [];
        foreach ($students as $i => $student) {
            $slug = preg_replace('/[^a-z0-9]/', '', strtolower(str_replace(' ', '', $student[7])));
            $parentEmail = 'parent' . ($i + 1) . '@school.test';
            $parentEmails[] = $parentEmail;

            User::query()->updateOrCreate(['email' => $parentEmail], [
                'name' => $student[7],
                'password' => 'password',
                'role' => 'parent',
                'email_verified_at' => now(),
            ]);

            $existingGuardian = DB::table('guardians')->where('email', $parentEmail)->first();
            if (!$existingGuardian) {
                $guardianId = DB::table('guardians')->insertGetId([
                    'name' => $student[7],
                    'email' => $parentEmail,
                    'phone' => $student[8],
                    'relation' => 'Father',
                    'district' => $student[9],
                    'address' => $student[10],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $existingStudent = DB::table('students')->where('student_id', $student[0])->first();
                if ($existingStudent) {
                    DB::table('student_guardian')->updateOrInsert([
                        'student_id' => $existingStudent->id,
                        'guardian_id' => $guardianId,
                    ]);
                }
            }
        }

        $teachers = [
            ['TCH-001', 'Md. Arif Hossain', 'Bangla', 'Senior Teacher', '01721000001', 'arif@school.test', 'Dhaka', '2015-01-12'],
            ['TCH-002', 'Sadia Sultana', 'English', 'Assistant Teacher', '01822000002', 'sadia@school.test', 'Cumilla', '2018-04-02'],
            ['TCH-003', 'Mahmudul Alam', 'Mathematics', 'Senior Teacher', '01923000003', 'mahmud@school.test', 'Mymensingh', '2013-07-15'],
            ['TCH-004', 'Farzana Hoque', 'Science', 'Assistant Teacher', '01624000004', 'farzana@school.test', 'Chattogram', '2020-02-20'],
            ['TCH-005', 'Imran Kabir', 'ICT', 'Lecturer', '01725000005', 'imran@school.test', 'Jashore', '2021-11-01'],
        ];

        foreach ($teachers as $teacher) {
            DB::table('teachers')->updateOrInsert(['employee_id' => $teacher[0]], [
                'name' => $teacher[1],
                'department' => $teacher[2],
                'designation' => $teacher[3],
                'phone' => $teacher[4],
                'email' => $teacher[5],
                'district' => $teacher[6],
                'joining_date' => $teacher[7],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed sample certificates
        $certificateTypes = ['Transfer Certificate', 'Character Certificate', 'Bonafide Certificate', 'Scholarship Certificate'];
        $allStudents = DB::table('students')->orderBy('id')->get();
        $certSeedData = [
            ['student_idx' => 0, 'type' => 'Character Certificate',     'no' => 'CERT-2026-001', 'content' => 'This is to certify that {name} is a student of this institution. He/She bears a good moral character and conducted himself/herself well throughout the academic period.'],
            ['student_idx' => 1, 'type' => 'Bonafide Certificate',      'no' => 'CERT-2026-002', 'content' => 'This is to certify that {name} is a bonafide student of this institution studying in the current academic year.'],
            ['student_idx' => 2, 'type' => 'Transfer Certificate',      'no' => 'CERT-2026-003', 'content' => 'This is to certify that {name} was a student of this institution from 2020 to 2026. He/She is hereby granted a Transfer Certificate to pursue further studies elsewhere.'],
            ['student_idx' => 3, 'type' => 'Scholarship Certificate',   'no' => 'CERT-2026-004', 'content' => 'This is to certify that {name} has been awarded a merit scholarship for outstanding academic performance in the annual examination.'],
            ['student_idx' => 4, 'type' => 'Character Certificate',     'no' => 'CERT-2026-005', 'content' => 'This is to certify that {name} is a diligent and sincere student. He/She has always shown exemplary conduct and discipline.'],
        ];

        foreach ($certSeedData as $cert) {
            $student = $allStudents[$cert['student_idx']] ?? null;
            if (!$student) continue;

            DB::table('certificates')->updateOrInsert(
                ['certificate_no' => $cert['no']],
                [
                    'student_id'    => $student->id,
                    'type'          => $cert['type'],
                    'issue_date'    => '2026-06-30',
                    'content'       => str_replace('{name}', $student->name, $cert['content']),
                    'remarks'       => null,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ],
            );
        }

        $allStudents->each(function ($student, int $index) {
            DB::table('attendances')->updateOrInsert([
                'student_id' => $student->id,
                'date' => now()->toDateString(),
            ], [
                'status' => $index === 5 ? 'absent' : 'present',
                'marked_by' => 'Md. Arif Hossain',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('fee_collections')->updateOrInsert([
                'invoice_no' => 'INV-2026-07-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
            ], [
                'student_id' => $student->id,
                'month' => 'July 2026',
                'amount' => $student->class_name === 'SSC Batch' ? 2500 : 1800,
                'status' => $index < 6 ? 'paid' : 'due',
                'due_date' => '2026-07-10',
                'paid_on' => $index < 6 ? '2026-07-03' : null,
                'payment_method' => $index < 6 ? ($index % 2 === 0 ? 'bKash' : 'Cash') : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        // Seed academic reports for some students (idempotent)
        $firstStudent = DB::table('students')->orderBy('id')->first();
        if ($firstStudent) {
            $reportId = DB::table('academic_reports')->updateOrInsert(
                ['student_id' => $firstStudent->id, 'exam_name' => 'Half Yearly Exam', 'academic_year' => '2026'],
                [
                    'class_position' => 4,
                    'working_days' => 90,
                    'present_days' => 86,
                    'absent_days' => 4,
                    'moral_evaluation' => 'Excellent',
                    'co_curricular' => json_encode(['Sports', 'Math Olympiad']),
                    'comments' => $firstStudent->name . ' has performed exceptionally well this term. Their dedication is highly commendable.',
                    'updated_at' => now(),
                ],
            );

            $report = DB::table('academic_reports')->where('student_id', $firstStudent->id)
                ->where('exam_name', 'Half Yearly Exam')->where('academic_year', '2026')->first();

            if ($report) {
                $reportId = $report->id;
                $subjectsMarks = [
                    ['BD & Glob.Studies', 100, 86, 55, 21, null, null],
                    ['Agriculture', 100, 93, 55, 12, null, null],
                    ['Physical and Mental Health Education', 100, 79, 45, 11, null, null],
                    ['Life and Livelihood', 100, 91, 60, 12, null, null],
                    ['Arts and Crafts', 100, 89, 65, 2, null, null],
                    ['Social Science', 100, 88, 65, 21, null, null],
                    ['Arabic-II', 100, 78, 43, 24, null, null],
                    ['Bangla 1st.', 100, 79, 56, 21, null, null],
                    ['English 1st.', 100, 95, 67, 23, null, null],
                    ['Mathematics', 100, 99, 55, 30, null, null],
                ];

                foreach ($subjectsMarks as $sm) {
                    DB::table('academic_report_marks')->updateOrInsert(
                        ['academic_report_id' => $reportId, 'subject_name' => $sm[0]],
                        [
                            'full_marks' => $sm[1],
                            'highest_marks' => $sm[2],
                            'written_marks' => $sm[3],
                            'mcq_marks' => $sm[4],
                            'practical_marks' => $sm[5],
                            'ca_marks' => $sm[6],
                            'updated_at' => now(),
                        ],
                    );
                }
            }
        }

        // Seed a passed student report (idempotent)
        $secondStudent = DB::table('students')->orderBy('id')->skip(1)->first();
        if ($secondStudent) {
            DB::table('academic_reports')->updateOrInsert(
                ['student_id' => $secondStudent->id, 'exam_name' => 'Half Yearly Exam', 'academic_year' => '2026'],
                [
                    'class_position' => 1,
                    'working_days' => 90,
                    'present_days' => 89,
                    'absent_days' => 1,
                    'moral_evaluation' => 'Excellent',
                    'co_curricular' => json_encode(['Debating', 'Science Club']),
                    'comments' => $secondStudent->name . ' is an outstanding student with a brilliant future.',
                    'updated_at' => now(),
                ],
            );

            $report = DB::table('academic_reports')->where('student_id', $secondStudent->id)
                ->where('exam_name', 'Half Yearly Exam')->where('academic_year', '2026')->first();

            if ($report) {
                $reportId = $report->id;
                $subjectsMarks = [
                    ['BD & Glob.Studies', 100, 86, 60, 20, null, null],
                    ['Agriculture', 100, 93, 62, 18, null, null],
                    ['Physical and Mental Health Education', 100, 79, 55, 20, null, null],
                    ['Life and Livelihood', 100, 91, 60, 25, null, null],
                    ['Arts and Crafts', 100, 89, 50, 25, null, null],
                    ['Social Science', 100, 88, 62, 18, null, null],
                    ['Arabic-II', 100, 78, 55, 15, null, null],
                    ['Bangla 1st.', 100, 79, 58, 22, null, null],
                    ['English 1st.', 100, 95, 65, 25, null, null],
                    ['Mathematics', 100, 99, 68, 27, null, null],
                ];

                foreach ($subjectsMarks as $sm) {
                    DB::table('academic_report_marks')->updateOrInsert(
                        ['academic_report_id' => $reportId, 'subject_name' => $sm[0]],
                        [
                            'full_marks' => $sm[1],
                            'highest_marks' => $sm[2],
                            'written_marks' => $sm[3],
                            'mcq_marks' => $sm[4],
                            'practical_marks' => $sm[5],
                            'ca_marks' => $sm[6],
                            'updated_at' => now(),
                        ],
                    );
                }
            }
        }

        // Seed configurations for reports
        DB::table('fail_lists')->insertOrIgnore([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('section_results')->insertOrIgnore([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('tabulation_sheets')->insertOrIgnore([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('merit_lists')->insertOrIgnore([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('admit_cards')->insertOrIgnore([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
            'instructions' => json_encode([
                'Examinee must entered into the exam hall at least 15 minutes before',
                'No extra papers will be allowed except the admit and registration card.',
                'Examinee must carry all necessary essentials for the exam e.g pen, pencil.',
                'Authority deserves all rights to expel the examinee due to unfair-means in the exam.'
            ]),
            'routine' => json_encode([
                'BD & Glob.Studies' => '01/07/2026 [Wed]',
                'Bangla 1st.' => '02/07/2026 [Thu]',
                'English 1st.' => '05/07/2026 [Sun]',
                'Social Science' => '06/07/2026 [Mon]',
                'Agriculture' => '07/07/2026 [Tue]',
                'Physical and Mental Health Education' => '09/07/2026 [Thu]',
                'Mathematics' => '11/07/2026 [Sat]',
                'Arabic-II' => '12/07/2026 [Sun]'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create user accounts for students without one
        DB::table('students')->whereNull('email')->chunkById(100, function ($students) {
            foreach ($students as $student) {
                $email = 'student.' . $student->id . '@school.test';
                DB::table('students')->where('id', $student->id)->update(['email' => $email]);
                User::query()->updateOrCreate(['email' => $email], [
                    'name' => $student->name,
                    'password' => 'password',
                    'role' => 'student',
                    'email_verified_at' => now(),
                ]);
            }
        });

        // Create user accounts for guardians without one
        DB::table('guardians')->whereNull('email')->chunkById(100, function ($guardians) {
            foreach ($guardians as $guardian) {
                $email = 'parent.' . $guardian->id . '@school.test';
                DB::table('guardians')->where('id', $guardian->id)->update(['email' => $email]);
                User::query()->updateOrCreate(['email' => $email], [
                    'name' => $guardian->name,
                    'password' => 'password',
                    'role' => 'parent',
                    'email_verified_at' => now(),
                ]);
            }
        });
    }
}
