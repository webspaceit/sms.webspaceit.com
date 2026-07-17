<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BangladeshSchoolDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            // ============================================================
            // 1. Academic Years
            // ============================================================
            $academicYear = DB::table('academic_years')->where('name', '2026')->first();

            if (!$academicYear) {
                DB::table('academic_years')->update(['is_current' => false]);

                $academicYearId = DB::table('academic_years')->insertGetId([
                    'name'        => '2026',
                    'start_date'  => '2026-01-01',
                    'end_date'    => '2026-12-31',
                    'is_current'  => true,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            } else {
                $academicYearId = $academicYear->id;

                if (!$academicYear->is_current) {
                    DB::table('academic_years')->where('id', '!=', $academicYearId)->update(['is_current' => false]);
                    DB::table('academic_years')->where('id', $academicYearId)->update(['is_current' => true, 'updated_at' => now()]);
                }
            }

            // ============================================================
            // 2. Classes (1-10)
            // ============================================================
            $classIds = [];

            for ($i = 1; $i <= 10; $i++) {
                $class = DB::table('classes')->where('name', "Class {$i}")->first();

                if (!$class) {
                    $shift = $i <= 5 ? 'Morning' : ($i <= 8 ? 'Day' : 'Both');
                    $classIds[$i] = DB::table('classes')->insertGetId([
                        'name'       => "Class {$i}",
                        'shift'      => $shift,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } else {
                    $classIds[$i] = $class->id;
                }
            }

            // ============================================================
            // 3. Subjects
            // ============================================================
            $subjects = [
                ['name' => 'Bangla',               'name_bn' => 'বাংলা',                         'code' => 'BAN'],
                ['name' => 'English',              'name_bn' => 'ইংরেজি',                        'code' => 'ENG'],
                ['name' => 'Mathematics',          'name_bn' => 'গণিত',                          'code' => 'MATH'],
                ['name' => 'BGS',                  'name_bn' => 'বাংলাদেশ ও বিশ্বপরিচিতি',       'code' => 'BGS'],
                ['name' => 'Science',              'name_bn' => 'বিজ্ঞান',                       'code' => 'SCI'],
                ['name' => 'Religion',             'name_bn' => 'ধর্ম',                          'code' => 'REL'],
                ['name' => 'ICT',                  'name_bn' => 'তথ্য ও যোগাযোগ প্রযুক্তি',      'code' => 'ICT'],
                ['name' => 'Arts & Crafts',        'name_bn' => 'চারুকলা',                       'code' => 'ART'],
                ['name' => 'Physical Education',   'name_bn' => 'শারীরিক শিক্ষা',                'code' => 'PE'],
                ['name' => 'Agriculture',          'name_bn' => 'কৃষি শিক্ষা',                   'code' => 'AGR'],
                ['name' => 'Life & Livelihood',    'name_bn' => 'জীবন ও জীবিকা',                 'code' => 'LNL'],
                ['name' => 'Arabic',               'name_bn' => 'আরবি',                          'code' => 'ARB'],
                ['name' => 'Social Science',       'name_bn' => 'সমাজ বিজ্ঞান',                  'code' => 'SS'],
            ];

            $subjectIds = [];

            foreach ($subjects as $subj) {
                $existing = DB::table('subjects')->where('name', $subj['name'])->first();

                if (!$existing) {
                    $subjectIds[$subj['name']] = DB::table('subjects')->insertGetId([
                        'name'       => $subj['name'],
                        'name_bn'    => $subj['name_bn'],
                        'code'       => $subj['code'],
                        'type'       => 'core',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } else {
                    $subjectIds[$subj['name']] = $existing->id;

                    if (empty($existing->name_bn)) {
                        DB::table('subjects')->where('id', $existing->id)->update([
                            'name_bn'    => $subj['name_bn'],
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            // ============================================================
            // 4. Class-Subject Mapping
            // ============================================================
            $subjectMapping = [
                // Primary (Class 1-5)
                1  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'Arts & Crafts', 'Physical Education'],
                2  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'Arts & Crafts', 'Physical Education'],
                3  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'Arts & Crafts', 'Physical Education'],
                4  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'Arts & Crafts', 'Physical Education'],
                5  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'Arts & Crafts', 'Physical Education'],
                // Junior Secondary (Class 6-8)
                6  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'ICT', 'Arts & Crafts', 'Physical Education', 'Agriculture', 'Life & Livelihood'],
                7  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'ICT', 'Arts & Crafts', 'Physical Education', 'Agriculture', 'Life & Livelihood'],
                8  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'ICT', 'Arts & Crafts', 'Physical Education', 'Agriculture', 'Life & Livelihood'],
                // Secondary (Class 9-10)
                9  => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'ICT', 'Agriculture', 'Life & Livelihood', 'Arabic', 'Social Science'],
                10 => ['Bangla', 'English', 'Mathematics', 'BGS', 'Science', 'Religion', 'ICT', 'Agriculture', 'Life & Livelihood', 'Arabic', 'Social Science'],
            ];

            foreach ($subjectMapping as $numericLevel => $subjNames) {
                $classId   = $classIds[$numericLevel];
                $sortOrder = 0;

                foreach ($subjNames as $subjName) {
                    $subjectId = $subjectIds[$subjName];

                    $existing = DB::table('class_subject')
                        ->where('class_id', $classId)
                        ->where('subject_id', $subjectId)
                        ->first();

                    if (!$existing) {
                        DB::table('class_subject')->insert([
                            'class_id'         => $classId,
                            'subject_id'       => $subjectId,
                            'full_marks'       => 100,
                            'written_marks'    => 60,
                            'mcq_marks'        => 30,
                            'practical_marks'  => in_array($subjName, ['Science', 'ICT']) ? 20 : null,
                            'ca_marks'         => 10,
                            'pass_marks'       => 33,
                            'sort_order'       => $sortOrder,
                            'created_at'       => now(),
                            'updated_at'       => now(),
                        ]);
                    }

                    $sortOrder++;
                }
            }

            // ============================================================
            // 5. Sections (A, B, C for each class)
            // ============================================================
            $sectionNames = ['A', 'B', 'C'];

            foreach ($classIds as $numericLevel => $classId) {
                foreach ($sectionNames as $index => $sectionName) {
                    $existing = DB::table('sections')
                        ->where('class_id', $classId)
                        ->where('name', $sectionName)
                        ->first();

                    if (!$existing) {
                        DB::table('sections')->insert([
                            'class_id'    => $classId,
                            'name'        => $sectionName,
                            'room_no'     => 'Room-' . str_pad((string) ($numericLevel * 10 + $index + 1), 3, '0', STR_PAD_LEFT),
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }
            }

            // ============================================================
            // 6. Fee Heads
            // ============================================================
            $feeHeads = [
                ['name' => 'Tuition Fee',     'name_bn' => 'মাসিক বেতন',     'frequency' => 'monthly',  'is_optional' => false, 'sort_order' => 1],
                ['name' => 'Admission Fee',   'name_bn' => 'ভর্তি ফি',       'frequency' => 'one-time', 'is_optional' => false, 'sort_order' => 2],
                ['name' => 'Development Fee', 'name_bn' => 'উন্নয়ন ফি',     'frequency' => 'monthly',  'is_optional' => false, 'sort_order' => 3],
                ['name' => 'Exam Fee',        'name_bn' => 'পরীক্ষার ফি',    'frequency' => 'yearly',   'is_optional' => false, 'sort_order' => 4],
                ['name' => 'Lab Fee',         'name_bn' => 'ল্যাব ফি',       'frequency' => 'monthly',  'is_optional' => false, 'sort_order' => 5],
                ['name' => 'Library Fee',     'name_bn' => 'গ্রন্থাগার ফি',  'frequency' => 'monthly',  'is_optional' => false, 'sort_order' => 6],
                ['name' => 'Sports Fee',      'name_bn' => 'ক্রীড়া ফি',     'frequency' => 'monthly',  'is_optional' => false, 'sort_order' => 7],
                ['name' => 'ICT Fee',         'name_bn' => 'আইসিটি ফি',     'frequency' => 'monthly',  'is_optional' => false, 'sort_order' => 8],
            ];

            foreach ($feeHeads as $feeHead) {
                $existing = DB::table('fee_heads')->where('name', $feeHead['name'])->first();

                if (!$existing) {
                    DB::table('fee_heads')->insert([
                        'name'        => $feeHead['name'],
                        'name_bn'     => $feeHead['name_bn'],
                        'frequency'   => $feeHead['frequency'],
                        'is_optional' => $feeHead['is_optional'],
                        'sort_order'  => $feeHead['sort_order'],
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            // ============================================================
            // 7. School Settings
            // ============================================================
            $settings = [
                ['key' => 'school_name',       'value' => 'WSIT School Management System'],
                ['key' => 'school_name_bn',    'value' => 'WSIT স্কুল ম্যানেজমেন্ট সিস্টেম'],
                ['key' => 'school_address',    'value' => 'Holding No. 00-0865, Gulshan Para, Chuadanga'],
                ['key' => 'school_address_bn', 'value' => 'হোল্ডিং নং ০০-০৮৬৫, গুলশান পাড়া, চুয়াডাঙ্গা'],
                ['key' => 'school_phone',      'value' => '017XXXXXXXX'],
                ['key' => 'school_email',      'value' => 'webspaceit@gmail.com'],
                ['key' => 'school_established','value' => '2000'],
                ['key' => 'school_eiin',       'value' => '123456'],
                ['key' => 'academic_year_id',  'value' => (string) $academicYearId],
                ['key' => 'school_footer',     'value' => 'Powered by: Web Space IT'],
                ['key' => 'school_footer_url', 'value' => 'https://webspaceit.com'],
                ['key' => 'currency',          'value' => 'BDT'],
            ];

            foreach ($settings as $setting) {
                DB::table('school_settings')->updateOrInsert(
                    ['key' => $setting['key']],
                    [
                        'value'      => $setting['value'],
                        'updated_at' => now(),
                    ]
                );
            }

            // ============================================================
            // 8. Guardians
            // ============================================================
            $guardianList = [
                ['name' => 'Md. Abdur Rahman',       'name_bn' => 'মোঃ আব্দুর রহমান',        'phone' => '01711111111', 'occupation' => 'Govt. Officer',        'relation' => 'Father', 'district' => 'Dhaka'],
                ['name' => 'Mrs. Salma Begum',        'name_bn' => 'মিসেস সালমা বেগম',        'phone' => '01711111112', 'occupation' => 'Teacher',             'relation' => 'Mother', 'district' => 'Dhaka'],
                ['name' => 'Md. Kamal Hossain',       'name_bn' => 'মোঃ কামাল হোসেন',          'phone' => '01711111113', 'occupation' => 'Businessman',         'relation' => 'Father', 'district' => 'Chattogram'],
                ['name' => 'Md. Nurul Islam',         'name_bn' => 'মোঃ নুরুল ইসলাম',          'phone' => '01711111114', 'occupation' => 'Doctor',              'relation' => 'Father', 'district' => 'Rajshahi'],
                ['name' => 'Mrs. Farida Yasmin',      'name_bn' => 'মিসেস ফরিদা ইয়াসমিন',      'phone' => '01711111115', 'occupation' => 'Housewife',           'relation' => 'Mother', 'district' => 'Khulna'],
                ['name' => 'Md. Abdul Malek',         'name_bn' => 'মোঃ আব্দুল মালেক',         'phone' => '01711111116', 'occupation' => 'Engineer',            'relation' => 'Father', 'district' => 'Sylhet'],
                ['name' => 'Md. Jahangir Alam',       'name_bn' => 'মোঃ জাহাঙ্গীর আলম',        'phone' => '01711111117', 'occupation' => 'Banker',              'relation' => 'Father', 'district' => 'Barishal'],
                ['name' => 'Mrs. Nasrin Akhter',      'name_bn' => 'মিসেস নাসরিন আক্তার',       'phone' => '01711111118', 'occupation' => 'Nurse',               'relation' => 'Mother', 'district' => 'Rangpur'],
                ['name' => 'Md. Shafiqul Islam',      'name_bn' => 'মোঃ শাফিকুল ইসলাম',        'phone' => '01711111119', 'occupation' => 'Lawyer',              'relation' => 'Father', 'district' => 'Mymensingh'],
                ['name' => 'Md. Abu Bakkar Siddique', 'name_bn' => 'মোঃ আবু বক্কর সিদ্দিক',    'phone' => '01711111120', 'occupation' => 'Businessman',         'relation' => 'Father', 'district' => 'Dhaka'],
                ['name' => 'Mrs. Rebeka Sultana',     'name_bn' => 'মিসেস রেবেকা সুলতানা',      'phone' => '01711111121', 'occupation' => 'Teacher',             'relation' => 'Mother', 'district' => 'Chattogram'],
                ['name' => 'Md. Mizanur Rahman',      'name_bn' => 'মোঃ মিজানুর রহমান',         'phone' => '01711111122', 'occupation' => 'Police Officer',       'relation' => 'Father', 'district' => 'Sylhet'],
                ['name' => 'Md. Rafiqul Islam',       'name_bn' => 'মোঃ রফিকুল ইসলাম',          'phone' => '01711111123', 'occupation' => 'Farmer',              'relation' => 'Father', 'district' => 'Rajshahi'],
                ['name' => 'Mrs. Kohinoor Begum',     'name_bn' => 'মিসেস কোহিনূর বেগম',        'phone' => '01711111124', 'occupation' => 'Housewife',           'relation' => 'Mother', 'district' => 'Khulna'],
                ['name' => 'Md. Harun Or Rashid',     'name_bn' => 'মোঃ হারুন অর রশীদ',        'phone' => '01711111125', 'occupation' => 'Army Officer',         'relation' => 'Father', 'district' => 'Dhaka'],
            ];

            foreach ($guardianList as $guardian) {
                $existing = DB::table('guardians')->where('phone', $guardian['phone'])->first();
                if (!$existing) {
                    DB::table('guardians')->insert([
                        'name'       => $guardian['name'],
                        'name_bn'    => $guardian['name_bn'],
                        'phone'      => $guardian['phone'],
                        'occupation' => $guardian['occupation'],
                        'relation'   => $guardian['relation'],
                        'address'    => 'Dhaka, Bangladesh',
                        'district'   => $guardian['district'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // ============================================================
            // 9. Sample Teachers
            // ============================================================
            $teacherList = [
                ['name' => 'Prof. Md. Azizul Haque',       'dept' => 'Bangla',             'desig' => 'Senior Teacher'],
                ['name' => 'Mrs. Shamima Akhter',          'dept' => 'English',            'desig' => 'Assistant Teacher'],
                ['name' => 'Md. Abdur Rouf',               'dept' => 'Mathematics',        'desig' => 'Senior Teacher'],
                ['name' => 'Mrs. Nasima Khatun',           'dept' => 'Science',            'desig' => 'Lecturer'],
                ['name' => 'Md. Shahidul Islam',           'dept' => 'BGS',                'desig' => 'Assistant Teacher'],
                ['name' => 'Md. Ruhul Amin',               'dept' => 'Religion',           'desig' => 'Senior Teacher'],
                ['name' => 'Mrs. Jahanara Begum',          'dept' => 'ICT',                'desig' => 'Lecturer'],
                ['name' => 'Md. Delwar Hossain',           'dept' => 'Physical Education', 'desig' => 'Assistant Teacher'],
            ];

            foreach ($teacherList as $t) {
                $existing = DB::table('teachers')->where('name', $t['name'])->first();
                if (!$existing) {
                    DB::table('teachers')->insert([
                        'employee_id'  => 'TCH-' . str_pad((string) random_int(100, 999), 3, '0', STR_PAD_LEFT),
                        'name'         => $t['name'],
                        'phone'        => '0171' . str_pad((string) random_int(1000000, 9999999), 7, '0', STR_PAD_LEFT),
                        'email'        => strtolower(str_replace(' ', '.', $t['name'])) . '@webspaceit.com',
                        'department'   => $t['dept'],
                        'designation'  => $t['desig'],
                        'joining_date' => '2020-01-01',
                        'district'     => 'Dhaka',
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ]);
                }
            }

            // ============================================================
            // 10. Sample Books
            // ============================================================
            $bookList = [
                ['title' => 'Bangla Byakoron',                'author' => 'Dr. Muhammad Shahidullah',   'qty' => 20],
                ['title' => 'English Grammar in Use',         'author' => 'Raymond Murphy',            'qty' => 15],
                ['title' => 'Higher Mathematics',             'author' => 'Dr. Mohammad Kaykobad',     'qty' => 10],
                ['title' => 'General Science',                'author' => 'National Curriculum Board', 'qty' => 25],
                ['title' => 'Bangladesh O Bishwa Porichiti',  'author' => 'NCTB',                      'qty' => 30],
                ['title' => 'ICT for Beginners',              'author' => 'Dr. Md. Mahbubul Alam',     'qty' => 12],
                ['title' => 'English Literature',             'author' => 'Dr. William Shakespeare',   'qty' => 8],
                ['title' => 'Physics',                        'author' => 'HC Verma',                  'qty' => 10],
                ['title' => 'Chemistry',                      'author' => 'Dr. S. Z. Haque',           'qty' => 10],
                ['title' => 'Biology',                        'author' => 'Dr. Abul Bashar',           'qty' => 10],
                ['title' => 'Islamic Studies',                'author' => 'Prof. Muhammad Ali',        'qty' => 20],
                ['title' => 'Bangladesh History',             'author' => 'Dr. Rahimunnessa',          'qty' => 15],
                ['title' => 'Computer Science',               'author' => 'Tamim Shahriar',            'qty' => 10],
                ['title' => 'Agriculture Studies',            'author' => 'Dr. Md. Khaled',            'qty' => 12],
                ['title' => 'Physical Education',             'author' => 'National Curriculum Board', 'qty' => 18],
            ];

            foreach ($bookList as $index => $book) {
                $existing = DB::table('books')->where('title', $book['title'])->first();
                if (!$existing) {
                    DB::table('books')->insert([
                        'title'       => $book['title'],
                        'author'      => $book['author'],
                        'publisher'   => 'National Curriculum & Textbook Board',
                        'isbn'        => '978-984-' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT) . '-' . str_pad((string) random_int(10, 99), 2, '0', STR_PAD_LEFT) . '-0',
                        'quantity'    => $book['qty'],
                        'available'   => $book['qty'] - random_int(0, 3),
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            // ============================================================
            // 11. Transport Routes
            // ============================================================
            $routeList = [
                ['name' => 'Uttara - Mirpur',           'desc' => 'Uttara sector 14 to Mirpur 10',     'fare' => 1500],
                ['name' => 'Gulshan - Banani',          'desc' => 'Gulshan 1 to Banani DOHS',           'fare' => 1200],
                ['name' => 'Motijheel - Faridabad',     'desc' => 'Motijheel to Faridabad',             'fare' => 1000],
                ['name' => 'Mohammadpur - Dhanmondi',   'desc' => 'Mohammadpur to Dhanmondi 32',        'fare' => 1300],
                ['name' => 'Bashundhara - Baridhara',   'desc' => 'Bashundhara R/A to Baridhara DOHS',  'fare' => 1100],
            ];

            foreach ($routeList as $r) {
                $existing = DB::table('transport_routes')->where('name', $r['name'])->first();
                if (!$existing) {
                    DB::table('transport_routes')->insert([
                        'name'        => $r['name'],
                        'description' => $r['desc'],
                        'fare'        => $r['fare'],
                        'driver_name' => 'Md. Kamal Uddin',
                        'driver_phone'=> '01710000001',
                        'vehicle_no'  => 'DHAKA-METRO-' . str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT),
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            // ============================================================
            // 12. Transport Stops
            // ============================================================
            $stopList = [
                ['name' => 'Uttara Sector 7',  'route_name' => 'Uttara - Mirpur'],
                ['name' => 'Uttara Sector 14', 'route_name' => 'Uttara - Mirpur'],
                ['name' => 'Mirpur 1',         'route_name' => 'Uttara - Mirpur'],
                ['name' => 'Mirpur 10',        'route_name' => 'Uttara - Mirpur'],
                ['name' => 'Gulshan 1',        'route_name' => 'Gulshan - Banani'],
                ['name' => 'Gulshan 2',        'route_name' => 'Gulshan - Banani'],
                ['name' => 'Banani DOHS',      'route_name' => 'Gulshan - Banani'],
                ['name' => 'Motijheel',        'route_name' => 'Motijheel - Faridabad'],
                ['name' => 'Faridabad',        'route_name' => 'Motijheel - Faridabad'],
                ['name' => 'Mohammadpur',      'route_name' => 'Mohammadpur - Dhanmondi'],
                ['name' => 'Dhanmondi 32',     'route_name' => 'Mohammadpur - Dhanmondi'],
            ];

            foreach ($stopList as $index => $stop) {
                $route = DB::table('transport_routes')->where('name', $stop['route_name'])->first();
                $existing = DB::table('transport_stops')->where('name', $stop['name'])->first();
                if ($route && !$existing) {
                    DB::table('transport_stops')->insert([
                        'transport_route_id' => $route->id,
                        'name'               => $stop['name'],
                        'sort_order'         => $index + 1,
                        'created_at'         => now(),
                        'updated_at'         => now(),
                    ]);
                }
            }

            // ============================================================
            // 13. Hostel Rooms
            // ============================================================
            $roomList = [
                ['no' => 'H-101', 'type' => 'single', 'capacity' => 1],
                ['no' => 'H-102', 'type' => 'single', 'capacity' => 1],
                ['no' => 'H-103', 'type' => 'double', 'capacity' => 2],
                ['no' => 'H-104', 'type' => 'double', 'capacity' => 2],
                ['no' => 'H-105', 'type' => 'double', 'capacity' => 2],
                ['no' => 'H-201', 'type' => 'triple', 'capacity' => 3],
                ['no' => 'H-202', 'type' => 'triple', 'capacity' => 3],
                ['no' => 'H-203', 'type' => 'triple', 'capacity' => 3],
                ['no' => 'H-301', 'type' => 'dormitory', 'capacity' => 6],
                ['no' => 'H-302', 'type' => 'dormitory', 'capacity' => 6],
            ];

            foreach ($roomList as $room) {
                $existing = DB::table('hostel_rooms')->where('room_no', $room['no'])->first();
                if (!$existing) {
                    DB::table('hostel_rooms')->insert([
                        'room_no'     => $room['no'],
                        'type'        => $room['type'],
                        'capacity'    => $room['capacity'],
                        'rent_per_bed'=> $room['capacity'] * 1000,
                        'facilities'  => 'Attached bathroom, fan, light, bed',
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            // ============================================================
            // 14. Sample Students (across classes)
            // ============================================================
            $studentNames = [
                'Md. Ariful Islam', 'Md. Sohel Rana', 'Md. Hasan Ali', 'Md. Siam Hossain', 'Md. Tariqul Islam',
                'Md. Mahmudul Hasan', 'Mrs. Sajeda Parvin', 'Md. Sabbir Ahmed', 'Md. Naimur Rahman', 'Mrs. Tasmia Jannat',
                'Md. Rakibul Islam', 'Md. Fahim Shahriar', 'Md. Jubayer Ali', 'Md. Ashraful Islam', 'Mrs. Nusrat Jahan',
                'Md. Mehedi Hasan', 'Md. Tanvir Ahmed', 'Md. Abir Hossain', 'Md. Saiful Islam', 'Mrs. Jannatul Ferdous',
            ];

            foreach ($studentNames as $index => $studentName) {
                $numericLevel = ($index % 10) + 1;
                $classId = $classIds[$numericLevel] ?? null;
                $section = DB::table('sections')->where('class_id', $classId)->inRandomOrder()->first();
                $guardian = DB::table('guardians')->inRandomOrder()->first();

                if (!$classId || !$section) continue;

                $existing = DB::table('students')->where('name', $studentName)->first();
                if (!$existing) {
                    DB::table('students')->insert([
                        'student_id'    => 'STU-' . now()->format('Y') . '-' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                        'name'          => $studentName,
                        'roll_no'       => ($index % 30) + 1,
                        'class_id'      => $classId,
                        'class_name'    => "Class {$numericLevel}",
                        'section_id'    => $section->id,
                        'section'       => $section->name,
                        'gender'        => str_contains($studentName, 'Mrs.') ? 'female' : 'male',
                        'date_of_birth' => '2010-01-01',
                        'blood_group'   => 'O+',
                        'religion'      => 'Islam',
                        'district'      => 'Dhaka',
                        'address'       => 'Dhaka, Bangladesh',
                        'guardian_name' => $guardian?->name ?? 'N/A',
                        'guardian_phone'=> $guardian?->phone ?? 'N/A',
                        'status'        => 'active',
                        'academic_year_id' => $academicYearId,
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ]);
                }
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        });
    }
}
