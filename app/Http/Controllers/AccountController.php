<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\BankReconciliation;
use App\Models\FeeCarryForward;
use App\Models\FeeDiscount;
use App\Models\FeeHead;
use App\Models\Student;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function dashboard(): Response
    {
        $totalIncome = Transaction::where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('type', 'expense')->sum('amount');
        $netProfit = $totalIncome - $totalExpense;
        $pendingReconciliations = BankReconciliation::where('status', 'pending')->count();
        $recentTransactions = Transaction::with('user')->latest()->take(10)->get();

        return Inertia::render('school/accounts/index', [
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netProfit' => $netProfit,
            'pendingReconciliations' => $pendingReconciliations,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    public function transactions(Request $request): Response
    {
        $query = Transaction::with('user');

        if ($request->input('type')) {
            $query->where('type', $request->input('type'));
        }
        if ($request->input('from')) {
            $query->whereDate('date', '>=', $request->input('from'));
        }
        if ($request->input('to')) {
            $query->whereDate('date', '<=', $request->input('to'));
        }

        return Inertia::render('school/accounts/transactions', [
            'transactions' => $query->latest('date')->get(),
            'filters' => $request->only(['type', 'from', 'to']),
        ]);
    }

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = Auth::id();
        Transaction::create($validated);

        return redirect()->route('accounts.transactions')
            ->with('success', 'Transaction recorded successfully.');
    }

    public function deleteTransaction(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('accounts.transactions')
            ->with('success', 'Transaction deleted.');
    }

    public function discounts(Request $request): Response
    {
        $discounts = FeeDiscount::with(['student', 'feeHead', 'approver'])->latest('date')->get();
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);
        $feeHeads = FeeHead::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/accounts/discounts', [
            'discounts' => $discounts,
            'students' => $students,
            'feeHeads' => $feeHeads,
        ]);
    }

    public function storeDiscount(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_head_id' => 'required|exists:fee_heads,id',
            'amount' => 'required|numeric|min:0',
            'reason' => 'required|string',
            'date' => 'required|date',
        ]);

        $validated['approved_by'] = Auth::id();
        FeeDiscount::create($validated);

        return redirect()->route('accounts.discounts')
            ->with('success', 'Fee discount applied.');
    }

    public function deleteDiscount(FeeDiscount $feeDiscount)
    {
        $feeDiscount->delete();
        return redirect()->route('accounts.discounts')
            ->with('success', 'Discount deleted.');
    }

    public function carryForwards(Request $request): Response
    {
        $carryForwards = FeeCarryForward::with(['student', 'academicYear'])->latest('date')->get();
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);
        $academicYears = AcademicYear::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/accounts/carry-forwards', [
            'carryForwards' => $carryForwards,
            'students' => $students,
            'academicYears' => $academicYears,
        ]);
    }

    public function storeCarryForward(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
            'date' => 'required|date',
        ]);

        FeeCarryForward::create($validated);

        return redirect()->route('accounts.carry-forwards')
            ->with('success', 'Fee carry forward recorded.');
    }

    public function deleteCarryForward(FeeCarryForward $feeCarryForward)
    {
        $feeCarryForward->delete();
        return redirect()->route('accounts.carry-forwards')
            ->with('success', 'Carry forward deleted.');
    }

    public function reconciliations(Request $request): Response
    {
        return Inertia::render('school/accounts/reconciliations', [
            'reconciliations' => BankReconciliation::latest('statement_date')->get(),
        ]);
    }

    public function storeReconciliation(Request $request)
    {
        $validated = $request->validate([
            'account_name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'statement_date' => 'required|date',
            'ending_balance' => 'required|numeric',
            'cleared_balance' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        $validated['difference'] = $validated['ending_balance'] - $validated['cleared_balance'];
        $validated['status'] = abs($validated['difference']) < 0.01 ? 'cleared' : 'discrepancy';
        BankReconciliation::create($validated);

        return redirect()->route('accounts.reconciliations')
            ->with('success', 'Bank reconciliation saved.');
    }

    public function updateReconciliation(Request $request, BankReconciliation $bankReconciliation)
    {
        $validated = $request->validate([
            'account_name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'statement_date' => 'required|date',
            'ending_balance' => 'required|numeric',
            'cleared_balance' => 'required|numeric',
            'status' => 'required|in:pending,cleared,discrepancy',
            'notes' => 'nullable|string',
        ]);

        $validated['difference'] = $validated['ending_balance'] - $validated['cleared_balance'];
        $bankReconciliation->update($validated);

        return redirect()->route('accounts.reconciliations')
            ->with('success', 'Reconciliation updated.');
    }

    public function deleteReconciliation(BankReconciliation $bankReconciliation)
    {
        $bankReconciliation->delete();
        return redirect()->route('accounts.reconciliations')
            ->with('success', 'Reconciliation deleted.');
    }
}
