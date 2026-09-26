"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "../lib/utils";

export interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

/** Phone-width column, centered on desktop, with room for the bottom nav. */
export function MobileShell({ children, nav }: { children: React.ReactNode; nav?: NavItem[] }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-background sm:border-x">
      <div className={cn(nav && "pb-28")}>{children}</div>
      {nav && <BottomNav items={nav} />}
    </div>
  );
}

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-safe"
    >
      <div className="mb-3 flex items-center justify-around rounded-3xl border bg-background/80 px-2 py-2 shadow-lg backdrop-blur-xl">
        {items.map(({ href, label, Icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-16 flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors",
                active && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {!!badge && (
                <span className="absolute right-2 top-0.5 min-w-4 rounded-full bg-destructive px-1 text-center text-[10px] leading-4 text-destructive-foreground">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Sticky, translucent header. `back` shows a back chevron; `large` renders a big page title. */
export function AppHeader({
  title,
  subtitle,
  back,
  actions,
  large = false,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: React.ReactNode;
  large?: boolean;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-background/80 px-4 pb-3 pt-safe backdrop-blur-xl">
      <div className="flex h-14 items-center gap-2">
        {back && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {!large && <h1 className="truncate text-lg font-semibold">{title}</h1>}
          {!large && subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      {large && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
    </header>
  );
}
