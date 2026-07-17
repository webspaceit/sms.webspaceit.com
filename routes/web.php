<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AdmitCardController;
use App\Http\Controllers\Admin\HeroSliderController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BatchAttendanceController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookIssueController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ClassRoutineController;

use App\Http\Controllers\ClassTeacherController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\ExamAttendanceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamScheduleController;
use App\Http\Controllers\ExamSuggestionController;
use App\Http\Controllers\FailListController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\FeeHeadController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\HostelAllocationController;
use App\Http\Controllers\IdCardController;
use App\Http\Controllers\InventoryCategoryController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\HostelRoomController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LessonPlanController;
use App\Http\Controllers\MeritListController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\OnlineExamController;
use App\Http\Controllers\PaymentGatewayController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SmsSettingController;
use App\Http\Controllers\SalaryPaymentController;
use App\Http\Controllers\SalaryStructureController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\StaffAttendanceController;
use App\Http\Controllers\SchoolSettingController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SectionResultController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentHouseController;
use App\Http\Controllers\StudentTransportController;
use App\Http\Controllers\StudyMaterialController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TabulationSheetController;
use App\Http\Controllers\TeacherAttendanceController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherSubjectController;
use App\Http\Controllers\TransportRouteController;
use App\Http\Controllers\TransportStopController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontController::class, 'home'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [SchoolController::class, 'dashboard'])->name('dashboard');

    // Core Management
    Route::resource('student-houses', StudentHouseController::class);
    Route::get('students/import', [StudentController::class, 'showImportForm'])->name('students.import');
    Route::post('students/import', [StudentController::class, 'import']);
    Route::resource('students', StudentController::class);
    Route::get('students/{student}/print', [StudentController::class, 'print'])->name('students.print');
    Route::put('students/{student}/toggle-status', [StudentController::class, 'toggleStatus'])->name('students.toggle-status');
    Route::resource('teachers', TeacherController::class);
    Route::resource('designations', DesignationController::class)->except(['create', 'show', 'edit']);
    Route::resource('guardians', GuardianController::class);
    Route::resource('attendance', AttendanceController::class);
    Route::resource('fees', FeeController::class);

    // Accounts
    Route::get('accounts', [AccountController::class, 'dashboard'])->name('accounts.dashboard');
    Route::get('accounts/transactions', [AccountController::class, 'transactions'])->name('accounts.transactions');
    Route::post('accounts/transactions', [AccountController::class, 'storeTransaction'])->name('accounts.transactions.store');
    Route::delete('accounts/transactions/{transaction}', [AccountController::class, 'deleteTransaction'])->name('accounts.transactions.destroy');
    Route::get('accounts/discounts', [AccountController::class, 'discounts'])->name('accounts.discounts');
    Route::post('accounts/discounts', [AccountController::class, 'storeDiscount'])->name('accounts.discounts.store');
    Route::delete('accounts/discounts/{feeDiscount}', [AccountController::class, 'deleteDiscount'])->name('accounts.discounts.destroy');
    Route::get('accounts/carry-forwards', [AccountController::class, 'carryForwards'])->name('accounts.carry-forwards');
    Route::post('accounts/carry-forwards', [AccountController::class, 'storeCarryForward'])->name('accounts.carry-forwards.store');
    Route::delete('accounts/carry-forwards/{feeCarryForward}', [AccountController::class, 'deleteCarryForward'])->name('accounts.carry-forwards.destroy');
    Route::get('accounts/reconciliations', [AccountController::class, 'reconciliations'])->name('accounts.reconciliations');
    Route::post('accounts/reconciliations', [AccountController::class, 'storeReconciliation'])->name('accounts.reconciliations.store');
    Route::put('accounts/reconciliations/{bankReconciliation}', [AccountController::class, 'updateReconciliation'])->name('accounts.reconciliations.update');
    Route::delete('accounts/reconciliations/{bankReconciliation}', [AccountController::class, 'deleteReconciliation'])->name('accounts.reconciliations.destroy');

    // Academic Structure
    Route::resource('academic-years', AcademicYearController::class);
    Route::resource('classes', ClassController::class);
    Route::resource('sections', SectionController::class);
    Route::resource('subjects', SubjectController::class);

    Route::resource('exams', ExamController::class);
    Route::post('exam-schedules/bulk', [ExamScheduleController::class, 'bulkStore'])->name('exam-schedules.bulk');
    Route::resource('exam-schedules', ExamScheduleController::class);

    // ID Cards
    Route::get('id-cards', [IdCardController::class, 'index'])->name('id-cards.index');

    // Reports & Results
    Route::get('reports/calculate-position', [ReportController::class, 'calculatePosition'])->name('reports.calculate-position');
    Route::resource('reports', ReportController::class);
    Route::resource('fail-lists', FailListController::class);
    Route::resource('section-results', SectionResultController::class);
    Route::resource('tabulation-sheets', TabulationSheetController::class);
    Route::resource('merit-lists', MeritListController::class);
    Route::resource('admit-cards', AdmitCardController::class);
    Route::resource('exam-suggestions', ExamSuggestionController::class)->except(['show', 'edit', 'update']);
    Route::resource('exam-attendances', ExamAttendanceController::class)->only(['index', 'store']);

    // Fees Structure
    Route::resource('fee-heads', FeeHeadController::class);
    Route::resource('fee-structures', FeeStructureController::class);

    // Teacher Management
    Route::resource('teacher-subjects', TeacherSubjectController::class);
    Route::resource('teacher-attendances', TeacherAttendanceController::class);
    Route::resource('leave-requests', LeaveRequestController::class);
    Route::resource('staff-attendances', StaffAttendanceController::class)->only(['index', 'store']);

    // Library
    Route::resource('books', BookController::class);
    Route::resource('book-issues', BookIssueController::class);

    // Transport
    Route::resource('transport-routes', TransportRouteController::class);
    Route::resource('transport-stops', TransportStopController::class);
    Route::resource('student-transport', StudentTransportController::class);

    // Hostel
    Route::resource('hostel-rooms', HostelRoomController::class);
    Route::resource('hostel-allocations', HostelAllocationController::class);

    // Payroll
    Route::resource('salary-structures', SalaryStructureController::class);
    Route::resource('salary-payments', SalaryPaymentController::class);

    // Class Teachers
    Route::get('class-teachers', [ClassTeacherController::class, 'index'])->name('class-teachers.index');
    Route::put('class-teachers/{section}', [ClassTeacherController::class, 'update'])->name('class-teachers.update');

    // Timetable
    Route::resource('class-routines', ClassRoutineController::class);

    // Notice Board
    Route::resource('notices', NoticeController::class);
    Route::resource('holidays', HolidayController::class);
    Route::resource('events', EventController::class);
    Route::resource('complaints', ComplaintController::class);

    // Certificates
    Route::resource('certificates', CertificateController::class);

    // Study Materials
    Route::resource('study-materials', StudyMaterialController::class)->except(['show', 'edit', 'update']);
    Route::resource('lesson-plans', LessonPlanController::class);
    Route::get('inventory', [InventoryItemController::class, 'index'])->name('inventory.index');
    Route::post('inventory', [InventoryItemController::class, 'store'])->name('inventory.store');
    Route::put('inventory/{inventoryItem}', [InventoryItemController::class, 'update'])->name('inventory.update');
    Route::delete('inventory/{inventoryItem}', [InventoryItemController::class, 'destroy'])->name('inventory.destroy');
    Route::post('inventory/categories', [InventoryCategoryController::class, 'store'])->name('inventory.categories.store');
    Route::put('inventory/categories/{inventoryCategory}', [InventoryCategoryController::class, 'update'])->name('inventory.categories.update');
    Route::delete('inventory/categories/{inventoryCategory}', [InventoryCategoryController::class, 'destroy'])->name('inventory.categories.destroy');

    // CMS
    Route::resource('hero-sliders', HeroSliderController::class)->except(['create', 'show', 'edit']);

    // Online Exams
    Route::resource('online-exams', OnlineExamController::class);
    Route::get('online-exams/{onlineExam}/questions', [OnlineExamController::class, 'questions'])->name('online-exams.questions');
    Route::post('online-exams/{onlineExam}/questions', [OnlineExamController::class, 'storeQuestion'])->name('online-exams.questions.store');
    Route::delete('online-exams/{onlineExam}/questions/{question}', [OnlineExamController::class, 'deleteQuestion'])->name('online-exams.questions.destroy');
    Route::get('online-exams/{onlineExam}/results', [OnlineExamController::class, 'results'])->name('online-exams.results');

    // Branches
    Route::resource('branches', BranchController::class);

    // SMS Settings
    Route::resource('sms-settings', SmsSettingController::class);

    // Payment Gateways
    Route::resource('payment-gateways', PaymentGatewayController::class);

    // Permissions
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('permissions/toggle', [PermissionController::class, 'toggle'])->name('permissions.toggle');
    Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

    // Settings
    Route::get('settings/school', [SchoolSettingController::class, 'index'])->name('settings.school');
    Route::put('settings/school', [SchoolSettingController::class, 'update'])->name('settings.school.update');

    // Batch Operations
    Route::get('batch-attendance', [BatchAttendanceController::class, 'create'])->name('batch-attendance.create');
    Route::post('batch-attendance', [BatchAttendanceController::class, 'store'])->name('batch-attendance.store');
});

require __DIR__.'/settings.php';
