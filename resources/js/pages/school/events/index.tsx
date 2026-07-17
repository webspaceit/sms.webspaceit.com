import { Head, Link, router } from '@inertiajs/react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Event = {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    color: string;
};

type Props = {
    events: Event[];
};

function getMonthDays(year: number, month: number) {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    return days;
}

export default function Index({ events }: Props) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = useMemo(() => getMonthDays(year, month), [year, month]);

    const eventsByDate: Record<string, Event[]> = {};
    events.forEach((e) => {
        const key = e.start_date;
        if (!eventsByDate[key]) eventsByDate[key] = [];
        eventsByDate[key].push(e);
    });

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Delete event "${title}"?`)) router.delete(`/events/${id}`);
    };

    const navigate = (delta: number) => {
        const d = new Date(year, month + delta, 1);
        setYear(d.getFullYear());
        setMonth(d.getMonth());
    };

    const dateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    return (
        <>
            <Head title="Calendar" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Clock className="size-6 text-emerald-600" /> Calendar
                        </h1>
                        <p className="text-sm text-muted-foreground">View and manage school events.</p>
                    </div>
                    <Button asChild>
                        <Link href="/events/create"><Plus className="mr-2 size-4" /> Add Event</Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>&larr;</Button>
                        <h2 className="text-lg font-semibold">{monthNames[month]} {year}</h2>
                        <Button variant="outline" size="sm" onClick={() => navigate(1)}>&rarr;</Button>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <div key={d} className="bg-muted p-2 text-center text-xs font-semibold text-muted-foreground">{d}</div>
                        ))}
                        {days.map((d, i) => (
                            <div key={i} className={`bg-card min-h-[80px] p-1 ${d === null ? '' : 'hover:bg-accent/50'}`}>
                                {d !== null && (
                                    <>
                                        <span className={`text-xs font-medium ${dateStr(d) === today.toISOString().slice(0, 10) ? 'bg-emerald-600 text-white rounded-full px-1.5' : ''}`}>{d}</span>
                                        <div className="mt-1 space-y-0.5">
                                            {(eventsByDate[dateStr(d)] ?? []).slice(0, 2).map((e) => (
                                                <div key={e.id} className="flex items-center gap-0.5 group relative">
                                                    <div className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: e.color || '#00704F' }} />
                                                    <span className="text-[10px] truncate">{e.title}</span>
                                                    <button
                                                        className="ml-auto hidden group-hover:block text-red-500 text-[10px] leading-none"
                                                        onClick={() => handleDelete(e.id, e.title)}
                                                    >&times;</button>
                                                </div>
                                            ))}
                                            {(eventsByDate[dateStr(d)] ?? []).length > 2 && (
                                                <span className="text-[10px] text-muted-foreground">+{eventsByDate[dateStr(d)].length - 2} more</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <section className="rounded-lg border bg-card">
                    <div className="px-4 py-3 border-b">
                        <h3 className="font-semibold">All Events</h3>
                    </div>
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Clock className="mx-auto size-10 mb-2 opacity-40" />
                            <p>No events yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {events.map((e) => (
                                <div key={e.id} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: e.color || '#00704F' }} />
                                        <div>
                                            <p className="font-medium text-sm">{e.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(e.start_date).toLocaleDateString()}{e.end_date ? ` - ${new Date(e.end_date).toLocaleDateString()}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/events/${e.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(e.id, e.title)} title="Delete">
                                            <Trash2 className="size-3.5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Calendar', href: '/events' }] };
