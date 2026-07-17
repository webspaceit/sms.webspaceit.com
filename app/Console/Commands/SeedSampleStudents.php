<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SeedSampleStudents extends Command
{
    protected $signature = 'seed:students';
    protected $description = 'Insert 100 sample students for testing';

    private array $maleNames = [
        'Mohammad', 'Abdul', 'Md.', 'Sayed', 'Kazi', 'Shah', 'Mizanur', 'Sabbir', 'Rakib', 'Nazmul',
        'Aminul', 'Hasib', 'Tanvir', 'Shakil', 'Sohel', 'Rashed', 'Firoz', 'Kamal', 'Jamil', 'Anwar',
    ];

    private array $femaleNames = [
        'Farhana', 'Nasrin', 'Jahanara', 'Shahnaz', 'Taslima', 'Rokeya', 'Shamima', 'Rahima',
        'Saleha', 'Maleka', 'Sharmin', 'Nargis', 'Parvin', 'Hasina', 'Rehana', 'Ferdousi',
        'Shahida', 'Khaleda', 'Zinat', 'Shamima',
    ];

    private array $lastNames = [
        'Islam', 'Haque', 'Chowdhury', 'Rahman', 'Mia', 'Sarker', 'Khan', 'Hossain', 'Ahmed', 'Ali',
        'Hasan', 'Mollah', 'Bhuiyan', 'Talukder', 'Pramanik', 'Sarder', 'Biswas', 'Das', 'Saha',
    ];

    private array $districts = [
        'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
        'Comilla', 'Narayanganj', 'Gazipur', 'Bogura', 'Jessore', 'Cox\'s Bazar', 'Tangail', 'Pabna',
    ];

    private array $bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    public function handle()
    {
        $classes = DB::table('classes')->orderBy('name')->get();
        $sections = DB::table('sections')->get()->groupBy('class_id');
        $academicYearId = DB::table('academic_years')->where('is_current', true)->value('id') ?? 1;

        $inserts = [];
        $now = now();

        foreach ($classes as $class) {
            $classSections = $sections->get($class->id, collect());
            $studentsPerClass = 10;

            for ($i = 0; $i < $studentsPerClass; $i++) {
                $section = $classSections->get($i % max(1, $classSections->count()));
                $isFemale = rand(0, 1) === 0;
                $firstNamePool = $isFemale ? $this->femaleNames : $this->maleNames;
                $firstName = $firstNamePool[array_rand($firstNamePool)];
                $lastName = $this->lastNames[array_rand($this->lastNames)];
                $fullName = "$firstName $lastName";

                $inserts[] = [
                    'student_id' => 'STU-' . now()->format('Y') . '-' . str_pad(count($inserts) + 1, 3, '0', STR_PAD_LEFT),
                    'name' => $fullName,
                    'class_name' => $class->name,
                    'section' => $section ? $section->name : 'A',
                    'class_id' => $class->id,
                    'section_id' => $section ? $section->id : null,
                    'academic_year_id' => $academicYearId,
                    'roll_no' => $i + 1,
                    'date_of_birth' => '20' . rand(8, 16) . '-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                    'gender' => $isFemale ? 'Female' : 'Male',
                    'guardian_name' => "Guardian of $fullName",
                    'guardian_phone' => '017' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT),
                    'district' => $this->districts[array_rand($this->districts)],
                    'address' => 'House-' . rand(1, 200) . ', Road-' . rand(1, 20) . ', ' . $this->districts[array_rand($this->districts)],
                    'blood_group' => $this->bloodGroups[array_rand($this->bloodGroups)],
                    'religion' => 'Islam',
                    'nationality' => 'Bangladeshi',
                    'status' => 'active',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (count($inserts) >= 100) break 2;
            }
        }

        DB::table('students')->insert($inserts);
        $this->info(count($inserts) . ' sample students inserted successfully.');
    }
}
