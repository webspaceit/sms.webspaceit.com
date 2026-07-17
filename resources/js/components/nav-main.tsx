import { ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

function NavItemRender({ item }: { item: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();
    const triggerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({ top: rect.top, left: rect.right + 8 });
        }
    }, []);

    useEffect(() => {
        const parent = triggerRef.current?.closest('[data-sidebar="sidebar"]');
        if (!parent) return;
        parent.addEventListener('scroll', updatePosition, true);
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            parent.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [updatePosition]);

    const [isOpen, setIsOpen] = useState(false);

    if (item.children) {
        return (
            <div
                ref={triggerRef}
                className="relative"
                onMouseEnter={() => { updatePosition(); setIsOpen(true); }}
                onMouseLeave={() => setIsOpen(false)}
            >
                <SidebarMenuButton
                    tooltip={{ children: item.title }}
                    className="cursor-default"
                >
                    {item.icon && <item.icon />}
                    <span className="flex-1">{item.title}</span>
                    <ChevronRight className={`size-3 transition-transform ${isOpen ? 'translate-x-0.5' : ''}`} />
                </SidebarMenuButton>
                {createPortal(
                    <div
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                        className={`${
                            isOpen ? 'visible opacity-100 translate-x-0' : 'invisible opacity-0 -translate-x-2'
                        } transition-all duration-200 fixed z-[9999] min-w-[200px] rounded-lg border bg-popover p-1.5 shadow-lg`}
                        style={{ top: position.top, left: position.left }}
                    >
                        {item.children.map((child) => (
                            <Link
                                key={child.title}
                                href={child.href ?? '#'}
                                prefetch
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                    isCurrentUrl(child.href ?? '')
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                            >
                                {child.icon && <child.icon className="size-4 shrink-0" />}
                                <span>{child.title}</span>
                            </Link>
                        ))}
                    </div>,
                    document.body
                )}
            </div>
        );
    }

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
                asChild
                isActive={isCurrentUrl(item.href ?? '')}
                tooltip={{ children: item.title }}
            >
                <Link href={item.href ?? '#'} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <NavItemRender key={item.title} item={item} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function NavGrouped({ groups = [] }: { groups: NavGroup[] }) {
    return groups.map((group) => {
        if (group.collapsible) {
            return (
                <SidebarGroup className="px-2 py-0" key={group.label}>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="group flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground">
                            <span className={group.labelClassName}>{group.label}</span>
                            <span className="flex items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 group-data-[state=open]:hidden"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 hidden group-data-[state=open]:block"><path d="M5 12h14"/></svg>
                            </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <NavItemRender key={item.title} item={item} />
                                ))}
                            </SidebarMenu>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>
            );
        }

        return (
            <SidebarGroup className="px-2 py-0" key={group.label}>
                <SidebarGroupLabel className={group.labelClassName}>{group.label}</SidebarGroupLabel>
                <SidebarMenu>
                    {group.items.map((item) => (
                        <NavItemRender key={item.title} item={item} />
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        );
    });
}
