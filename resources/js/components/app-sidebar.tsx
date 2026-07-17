import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Award,
    BadgeCheck,
    Banknote,
    BedDouble,
    Box,
    ClipboardCheck,
    Bell,
    BookOpen,
    BookMarked,
    DollarSign,
    Percent,
    Building2,
    Bus,
    CalendarCheck,
    Clock,
    CreditCard,
    FileSpreadsheet,
    FileText,
    Upload,
    Globe,
    GraduationCap,
    Home,
    IdCard,
    LayoutGrid,
    Library,
    MessageSquare,
    List,
    MapPin,
    Receipt,
    ScrollText,
    Search,
    Settings,
    Shield,
    Timer,
    Trophy,
    Truck,
    User,
    UserCheck,
    UsersRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { NavGrouped } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup, NavItem } from '@/types';

const navGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ],
    },
    {
        label: 'Student Information',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Student Details', href: '/students', icon: GraduationCap },
            { title: 'Student Admission', href: '/students/create', icon: GraduationCap },
            { title: 'Import Students', href: '/students/import', icon: Upload },
            { title: 'Student Houses', href: '/student-houses', icon: Home },
            { title: 'Guardians', href: '/guardians', icon: User },
        ],
    },
    {
        label: 'Academic',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Teachers', icon: UsersRound, children: [
                { title: 'All Teachers', href: '/teachers', icon: UsersRound },
                { title: 'Designations', href: '/designations', icon: BadgeCheck },
            ] },
            { title: 'Classes', href: '/classes', icon: Building2 },
            { title: 'Sections', href: '/sections', icon: List },
            { title: 'Subjects', href: '/subjects', icon: BookOpen },

            { title: 'Academic Years', href: '/academic-years', icon: CalendarCheck },
            { title: 'Class Teachers', href: '/class-teachers', icon: UserCheck },
            { title: 'Study Materials', href: '/study-materials', icon: FileText },
            { title: 'Lesson Plans', href: '/lesson-plans', icon: ScrollText },
        ],
    },
    {
        label: 'Exams & Results',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Exams', href: '/exams', icon: FileSpreadsheet },
            { title: 'Exam Schedules', href: '/exam-schedules', icon: Clock },
            { title: 'Reports', href: '/reports', icon: FileSpreadsheet },
            { title: 'Fail Lists', href: '/fail-lists', icon: AlertTriangle },
            { title: 'Section Results', href: '/section-results', icon: BookOpen },
            { title: 'Tabulation Sheets', href: '/tabulation-sheets', icon: FileSpreadsheet },
            { title: 'Merit Lists', href: '/merit-lists', icon: Trophy },
            { title: 'Admit Cards', href: '/admit-cards', icon: IdCard },
            { title: 'Exam Suggestions', href: '/exam-suggestions', icon: FileText },
            { title: 'Exam Attendance', href: '/exam-attendances', icon: ClipboardCheck },
            { title: 'ID Cards', href: '/id-cards', icon: IdCard },
            { title: 'Certificates', href: '/certificates', icon: Award },
            { title: 'Online Examinations', href: '/online-exams', icon: Globe },
        ],
    },
    {
        label: 'Attendance',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Student Attendance', href: '/attendance', icon: CalendarCheck },
            { title: 'Batch Attendance', href: '/batch-attendance', icon: Timer },
            { title: 'Teacher Attendance', href: '/teacher-attendances', icon: Shield },
            { title: 'Leave Requests', href: '/leave-requests', icon: ScrollText },
            { title: 'Staff Attendance', href: '/staff-attendances', icon: ClipboardCheck },
        ],
    },
    {
        label: 'Finance',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Fee Collections', href: '/fees', icon: Banknote },
            { title: 'Fee Heads', href: '/fee-heads', icon: CreditCard },
            { title: 'Fee Structures', href: '/fee-structures', icon: Receipt },
            { title: 'Salary Structures', href: '/salary-structures', icon: Home },
            { title: 'Salary Payments', href: '/salary-payments', icon: Banknote },
        ],
    },
    {
        label: 'Accounts',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Account Dashboard', href: '/accounts', icon: DollarSign },
            { title: 'Transactions', href: '/accounts/transactions', icon: Receipt },
            { title: 'Fee Discounts', href: '/accounts/discounts', icon: Percent },
            { title: 'Fee Carry Forwards', href: '/accounts/carry-forwards', icon: Banknote },
            { title: 'Bank Reconciliations', href: '/accounts/reconciliations', icon: Banknote },
        ],
    },
    {
        label: 'Teacher Assignments',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Teacher Subjects', href: '/teacher-subjects', icon: BookOpen },
            { title: 'Class Routines', href: '/class-routines', icon: Clock },
        ],
    },
    {
        label: 'Facilities',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Library Books', href: '/books', icon: Library },
            { title: 'Book Issues', href: '/book-issues', icon: BookMarked },
            { title: 'Transport Routes', href: '/transport-routes', icon: Bus },
            { title: 'Transport Stops', href: '/transport-stops', icon: MapPin },
            { title: 'Student Transport', href: '/student-transport', icon: Truck },
            { title: 'Hostel Rooms', href: '/hostel-rooms', icon: BedDouble },
            { title: 'Hostel Allocations', href: '/hostel-allocations', icon: Home },
            { title: 'Inventory', href: '/inventory', icon: Box },
        ],
    },
    {
        label: 'Communication',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'Notice Board', href: '/notices', icon: Bell },
            { title: 'Holidays', href: '/holidays', icon: CalendarCheck },
            { title: 'Calendar', href: '/events', icon: Clock },
            { title: 'Complaints', href: '/complaints', icon: AlertTriangle },
        ],
    },
    {
        label: 'Settings',
        labelClassName: 'font-bold italic text-base',
        collapsible: true,
        items: [
            { title: 'School Settings', href: '/settings/school', icon: Settings },
            { title: 'Permissions & Roles', href: '/permissions', icon: Shield },
            { title: 'SMS Integration', href: '/sms-settings', icon: MessageSquare },
            { title: 'Payment Gateways', href: '/payment-gateways', icon: CreditCard },
            { title: 'Branches', href: '/branches', icon: Building2 },
        ],
    },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const [search, setSearch] = useState('');

    const allGroups = useMemo(
        () => [
            ...navGroups.slice(0, -1),
            {
                ...navGroups[navGroups.length - 1],
                items: [
                    ...navGroups[navGroups.length - 1].items,
                    { title: 'Website', href: '/', icon: Globe },
                ],
            },
        ],
        [],
    );

    const filteredGroups = useMemo(() => {
        if (!search.trim()) return allGroups;
        const q = search.toLowerCase();
        return allGroups
            .map((group) => ({
                ...group,
                items: group.items.filter((item) => item.title.toLowerCase().includes(q)),
            }))
            .filter((group) => group.items.length > 0);
    }, [allGroups, search]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {state === 'expanded' && (
                <div className="px-3 pb-1">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <SidebarInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search menus..."
                            className="pl-7"
                        />
                    </div>
                </div>
            )}

            <SidebarContent>
                <NavGrouped groups={filteredGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
