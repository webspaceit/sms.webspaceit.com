import { Head, Link } from '@inertiajs/react';
import { Banknote, Percent, Receipt, ArrowUpDown, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    pendingReconciliations: number;
    recentTransactions: {
        id: number; type: string; category: string; amount: string; description: string | null;
        date: string; payment_method: string | null; user: { name: string } | null;
    }[];
};

export default function Index({ totalIncome, totalExpense, netProfit, pendingReconciliations, recentTransactions }: Props) {
    const formatCurrency = (val: number) => '৳' + val.toLocaleString('en-BD', { minimumFractionDigits: 2 });

    return (
        <>
            <Head title="Accounts Dashboard" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <Banknote className="size-6 text-emerald-600" /> Accounts Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">Profit/Loss overview and account management.</p>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                                <TrendingUp className="size-5" /> {formatCurrency(totalIncome)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Expense</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600 flex items-center gap-2">
                                <TrendingDown className="size-5" /> {formatCurrency(totalExpense)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Net Profit/Loss</CardTitle></CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold flex items-center gap-2 ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                <DollarSign className="size-5" /> {formatCurrency(netProfit)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending Reconciliations</CardTitle></CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold flex items-center gap-2 ${pendingReconciliations > 0 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                <AlertTriangle className="size-5" /> {pendingReconciliations}
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section className="flex flex-wrap gap-2">
                    <Button asChild><Link href="/accounts/transactions"><Receipt className="mr-2 size-4" /> Transactions</Link></Button>
                    <Button asChild variant="outline"><Link href="/accounts/discounts"><Percent className="mr-2 size-4" /> Fee Discounts</Link></Button>
                    <Button asChild variant="outline"><Link href="/accounts/carry-forwards"><ArrowUpDown className="mr-2 size-4" /> Carry Forwards</Link></Button>
                    <Button asChild variant="outline"><Link href="/accounts/reconciliations"><Banknote className="mr-2 size-4" /> Reconciliations</Link></Button>
                </section>

                <section className="rounded-lg border bg-card">
                    <div className="px-4 py-3 border-b"><h3 className="font-semibold">Recent Transactions</h3></div>
                    {recentTransactions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Receipt className="mx-auto size-10 mb-2 opacity-40" />
                            <p>No transactions yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium">Type</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Recorded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((t) => (
                                    <tr key={t.id} className="border-b last:border-0">
                                        <td className="px-4 py-3">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{t.category}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{'৳' + parseFloat(t.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{t.user?.name ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Accounts', href: '/accounts' }] };
