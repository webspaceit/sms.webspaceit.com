<?php

namespace App\Console\Commands;

use App\Models\SchoolSetting;
use App\Models\Student;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ReformatStudentIds extends Command
{
    protected $signature   = 'students:reformat-ids {--prefix= : Override the admission prefix}';
    protected $description = 'Re-number all student IDs to match the admission prefix format (PREFIX-YEAR-NNN)';

    public function handle(): int
    {
        $prefix = $this->option('prefix')
            ?? SchoolSetting::where('key', 'admission_prefix')->value('value')
            ?? 'STU';

        $year = SchoolSetting::where('key', 'academic_year_id')->value('value') ?? now()->format('Y');

        $this->info("Reformatting student IDs to format: {$prefix}-{$year}-NNN");

        $students = Student::orderBy('id')->get(['id', 'student_id']);
        $total    = $students->count();

        if ($total === 0) {
            $this->warn('No students found.');
            return self::SUCCESS;
        }

        if (!$this->confirm("This will update {$total} student ID(s). Continue?", true)) {
            $this->info('Aborted.');
            return self::SUCCESS;
        }

        DB::transaction(function () use ($students, $prefix, $year) {
            // First pass: set all to a temp value to avoid unique constraint conflicts
            foreach ($students as $index => $student) {
                $student->update(['student_id' => "TEMP-{$student->id}"]);
            }

            // Second pass: assign proper IDs
            foreach ($students as $index => $student) {
                $newId = "{$prefix}-{$year}-" . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
                $student->update(['student_id' => $newId]);
                $this->line("  #{$student->id}: {$newId}");
            }
        });

        $this->info("✓ Done. {$total} student ID(s) updated.");
        return self::SUCCESS;
    }
}
