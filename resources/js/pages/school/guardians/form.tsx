import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type StudentInfo = {
    id: number;
    student_id: string;
    name: string;
    roll_no: number;
    class_name: string;
    section: string;
    schoolClass?: { id: number; name: string } | null;
};

type Guardian = {
    id: number;
    name: string;
    name_bn: string | null;
    phone: string;
    email: string | null;
    occupation: string | null;
    relation: string;
    address: string | null;
    district: string;
    nid: string | null;
    students: StudentInfo[];
};

type Props = {
    guardian?: Guardian;
    isEdit: boolean;
    students: StudentInfo[];
};

const districts = [
    'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria',
    'Chandpur', 'Chattogram', 'Chuadanga', 'Comilla', "Cox's Bazar",
    'Dhaka', 'Dinajpur',
    'Faridpur', 'Feni',
    'Gaibandha', 'Gazipur', 'Gopalganj',
    'Habiganj',
    'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat',
    'Khagrachari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia',
    'Lakshmipur', 'Lalmonirhat',
    'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh',
    'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali',
    'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur',
    'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur',
    'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet',
    'Tangail', 'Thakurgaon',
];

export default function Form({ guardian, isEdit, students }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: guardian?.name ?? '',
        name_bn: guardian?.name_bn ?? '',
        phone: guardian?.phone ?? '',
        email: guardian?.email ?? '',
        occupation: guardian?.occupation ?? '',
        relation: guardian?.relation ?? '',
        address: guardian?.address ?? '',
        district: guardian?.district ?? '',
        nid: guardian?.nid ?? '',
        student_ids: guardian?.students?.map((s) => String(s.id)) ?? [],
    });

    const studentOptions = students.map((s) => ({
        value: String(s.id),
        label: `${s.name} (${(s.schoolClass?.name ?? s.class_name) || '-'}-${s.section || '-'}, Roll: ${s.roll_no})`,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            student_ids: data.student_ids.map(Number),
        };
        if (isEdit && guardian) put(`/guardians/${guardian.id}`, payload);
        else post('/guardians', payload);
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Guardian' : 'Create Guardian'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/guardians"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Guardian' : 'Create Guardian'}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? 'Update guardian information and linked students.' : 'Add a new guardian and link to students.'}
                        </p>
                    </div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name (English)</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Md. Abdur Rahim" required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name_bn">Name (Bangla)</Label>
                            <Input id="name_bn" value={data.name_bn} onChange={(e) => setData('name_bn', e.target.value)} placeholder="e.g. মোঃ আব্দুর রহিম" />
                            {errors.name_bn && <p className="text-sm text-red-500">{errors.name_bn}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="e.g. 017XXXXXXXX" required />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="e.g. parent@email.com" />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input id="occupation" value={data.occupation} onChange={(e) => setData('occupation', e.target.value)} placeholder="e.g. Business" />
                            {errors.occupation && <p className="text-sm text-red-500">{errors.occupation}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relation">Relation <span className="text-red-500">*</span></Label>
                            <Input id="relation" value={data.relation} onChange={(e) => setData('relation', e.target.value)} placeholder="e.g. Father" required />
                            {errors.relation && <p className="text-sm text-red-500">{errors.relation}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input id="district" value={data.district} onChange={(e) => setData('district', e.target.value)} placeholder="e.g. Dhaka" required />
                            {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nid">NID</Label>
                            <Input id="nid" value={data.nid} onChange={(e) => setData('nid', e.target.value)} placeholder="e.g. 1234567890" />
                            {errors.nid && <p className="text-sm text-red-500">{errors.nid}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Full address..."
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Linked Students</Label>
                        <SearchableSelect
                            options={studentOptions}
                            value=""
                            onChange={(v) => {
                                if (v && !data.student_ids.includes(v)) {
                                    setData('student_ids', [...data.student_ids, v]);
                                }
                            }}
                            placeholder="Search and select students to link..."
                        />
                        {data.student_ids.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.student_ids.map((id) => {
                                    const s = students.find((st) => String(st.id) === id);
                                    if (!s) return null;
                                    return (
                                        <span
                                            key={id}
                                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                        >
                                            {s.name} ({(s.schoolClass?.name ?? s.class_name) || '-'}-{s.section || '-'})
                                            <button
                                                type="button"
                                                onClick={() => setData('student_ids', data.student_ids.filter((sid) => sid !== id))}
                                                className="ml-1 text-emerald-500 hover:text-red-500"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                        {errors.student_ids && <p className="text-sm text-red-500">{errors.student_ids}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/guardians">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = {
    breadcrumbs: [
        { title: 'Guardians', href: '/guardians' },
        { title: 'Manage', href: '' },
    ],
};