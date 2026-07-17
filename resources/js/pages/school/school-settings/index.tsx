import { Head, useForm } from '@inertiajs/react';
import { Building, BookOpen, Settings as SettingsIcon, Save, Languages } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SearchableSelect from '@/components/ui/searchable-select';

type Setting = { key: string; value: string };

const groups = [
    {
        title: 'School Information',
        icon: Building,
        keys: ['school_name', 'school_name_bn', 'school_phone', 'school_email', 'school_address', 'school_address_bn', 'school_established', 'school_eiin'],
    },
    {
        title: 'Academic & Financial',
        icon: BookOpen,
        keys: ['academic_year_id', 'currency', 'admission_prefix'],
    },
    {
        title: 'Footer',
        icon: SettingsIcon,
        keys: ['school_footer', 'school_footer_url'],
    },
];

const currencyOptions = [
    { value: 'BDT', label: 'BDT (৳)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'INR', label: 'INR (₹)' },
    { value: 'PKR', label: 'PKR (₨)' },
    { value: 'NPR', label: 'NPR (₨)' },
    { value: 'LKR', label: 'LKR (₨)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
];

function SettingField({ setting, data, setData, errors, academicYears }: {
    setting: Setting; data: Record<string, string>; setData: (k: string, v: string) => void; errors: Record<string, string>; academicYears: { id: number; name: string }[];
}) {
    const isBengali = setting.key.endsWith('_bn');
    const englishKey = isBengali ? setting.key.replace(/_bn$/, '') : null;
    const hasEnglishSource = englishKey && data[englishKey] !== undefined;

    const handleTranslate = async () => {
        if (!hasEnglishSource || !data[englishKey!]) return;
        try {
            const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(data[englishKey!])}`
            );
            const json = await res.json();
            const translated = json[0]?.[0]?.[0];
            if (translated) setData(setting.key, translated);
        } catch {
            setData(setting.key, data[englishKey!]);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label htmlFor={setting.key} className="capitalize">{setting.key.replace(/_/g, ' ')}</Label>
                {isBengali && hasEnglishSource && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" onClick={handleTranslate} className="text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                                <Languages className="size-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs">Translate from {englishKey!.replace(/_/g, ' ')}</p></TooltipContent>
                    </Tooltip>
                )}
            </div>
            {setting.key === 'currency' ? (
                <Select value={data.currency ?? 'BDT'} onValueChange={(v) => setData('currency', v)}>
                    <SelectTrigger id="currency"><SelectValue placeholder="Select currency" /></SelectTrigger>
                    <SelectContent>
                        {currencyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : setting.key === 'academic_year_id' ? (
                <SearchableSelect
                    options={academicYears.map((ay) => ({ value: ay.name, label: ay.name }))}
                    value={data.academic_year_id ?? ''}
                    onChange={(v) => setData('academic_year_id', v)}
                    placeholder="Search academic year..."
                />
            ) : setting.key === 'admission_prefix' ? (
                <div className="space-y-1">
                    <Input
                        id={setting.key}
                        value={data[setting.key] ?? ''}
                        onChange={(e) => setData(setting.key, e.target.value)}
                        placeholder="e.g. STU"
                    />
                    <p className="text-xs text-muted-foreground">
                        Preview:{' '}
                        <span className="font-mono font-semibold text-primary">
                            {(data[setting.key] || 'STU')}-{new Date().getFullYear()}-001
                        </span>
                    </p>
                </div>
            ) : (
                <Input id={setting.key} value={data[setting.key] ?? ''} onChange={(e) => setData(setting.key, e.target.value)} />
            )}
            {errors[setting.key] && <p className="text-sm text-red-500">{errors[setting.key]}</p>}
        </div>
    );
}

export default function SchoolSettings({ settings, academicYears }: { settings: Setting[]; academicYears: { id: number; name: string }[] }) {
    const { data, setData, put, processing, errors } = useForm<Record<string, string>>(
        Object.fromEntries(settings.map((s) => [s.key, s.value]))
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/school');
    };

    const settingsMap = useMemo(() => new Map(settings.map((s) => [s.key, s])), [settings]);

    return (
        <>
            <Head title="School Settings" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2"><SettingsIcon className="size-6 text-slate-600" /> School Settings</h1>
                    <p className="text-sm text-muted-foreground">Configure global school settings.</p>
                </div>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card shadow-sm overflow-hidden space-y-0">
                    {settings.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No settings configured.</p>
                    ) : (
                        groups.map((group) => {
                            const groupSettings = group.keys.map((k) => settingsMap.get(k)).filter(Boolean) as Setting[];
                            if (groupSettings.length === 0) return null;
                            return (
                                <div key={group.title}>
                                    <div className="bg-muted/50 border-y px-4 py-2 flex items-center gap-2">
                                        <group.icon className="size-4 text-muted-foreground" />
                                        <h3 className="text-sm font-semibold">{group.title}</h3>
                                    </div>
                                    <div className="px-4 py-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {groupSettings.map((setting) => (
                                                <SettingField key={setting.key} setting={setting} data={data} setData={setData} errors={errors} academicYears={academicYears} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {settings.length > 0 && (
                        <div className="flex justify-end gap-3 px-4 py-4 border-t bg-muted/20">
                            <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> Save Settings</Button>
                        </div>
                    )}
                </form>
            </main>
        </>
    );
}

SchoolSettings.layout = { breadcrumbs: [{ title: 'School Settings', href: '/settings/school' }] };
