import { BarChart3, Columns3, Hexagon, LayoutDashboard, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type AdminSidebarActiveItem = "dashboard" | "pipeline" | "financial-insights";

function SidebarItem({
  icon: Icon,
  href,
  active = false,
  label,
}: {
  icon: LucideIcon;
  href: string;
  active?: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`relative flex h-12 w-12 items-center justify-center rounded-md transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-background hover:text-foreground"
      }`}
      aria-label={label}
    >
      {active ? <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-primary" /> : null}
      <Icon className="size-5" aria-hidden />
    </Link>
  );
}

export function AdminSidebar({ activeItem }: { activeItem: AdminSidebarActiveItem }) {
  return (
    <nav
      aria-label="Admin sections"
      className="fixed inset-y-0 left-0 z-40 hidden w-20 shrink-0 flex-col items-center border-r border-border bg-secondary/80 py-6 shadow-[0_0_32px_rgba(0,0,0,0.06)] backdrop-blur md:flex"
    >
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Hexagon className="size-5" aria-hidden />
      </div>
      <div className="flex w-full flex-1 flex-col items-center gap-6">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/admin" active={activeItem === "dashboard"} />
        <SidebarItem icon={Columns3} label="Pipeline" href="/admin?tab=pipeline" active={activeItem === "pipeline"} />
        <SidebarItem icon={Users} label="Clients" href="/admin" />
        <SidebarItem icon={BarChart3} label="Financial Insights" href="/financial-insights" active={activeItem === "financial-insights"} />
      </div>
      <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold">
        VS
      </div>
    </nav>
  );
}
