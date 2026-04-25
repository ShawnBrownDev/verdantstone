import { BarChart3, Calendar, Columns3, Hexagon, Inbox, LayoutDashboard, TrendingDown, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchFinancialInsightsData, type FinancialEntryType } from "../lib/financial-insights-data";

export const metadata: Metadata = {
  title: "Financial Intelligence | Verdant & Stone",
  description: "Review assets, liabilities, and equity from your live financial ledger.",
};

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

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

function typePill(type: FinancialEntryType) {
  if (type === "asset") return "bg-emerald-100 text-emerald-700";
  if (type === "liability") return "bg-red-100 text-red-700";
  return "bg-sky-100 text-sky-700";
}

export default async function FinancialInsightsPage() {
  const { totals, entries } = await fetchFinancialInsightsData();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <nav
        aria-label="Admin sections"
        className="fixed inset-y-0 left-0 z-40 hidden w-20 shrink-0 flex-col items-center border-r border-border bg-secondary/80 py-6 shadow-[0_0_32px_rgba(0,0,0,0.06)] backdrop-blur md:flex"
      >
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Hexagon className="size-5" aria-hidden />
        </div>
        <div className="flex w-full flex-1 flex-col items-center gap-6">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/admin" />
          <SidebarItem icon={Columns3} label="Pipeline" href="/admin?tab=pipeline" />
          <SidebarItem icon={Users} label="Clients" href="/admin" />
          <SidebarItem icon={Calendar} label="Schedule" href="/admin" />
          <SidebarItem icon={BarChart3} label="Financial Insights" href="/financial-insights" active />
          <SidebarItem icon={Inbox} label="Inbox" href="/admin" />
        </div>
      </nav>

      <main className="flex w-full flex-1 flex-col p-4 md:pl-28 md:pr-8 md:pt-8">
        <section className="mb-8">
          <h1 className="font-headings text-3xl font-bold tracking-tight">Financial Intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live balance-sheet visibility powered directly by your Neon data.</p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-background p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assets</p>
              <TrendingUp className="size-4 text-emerald-600" aria-hidden />
            </div>
            <p className="font-headings text-3xl font-bold">{currencyFormat.format(totals.asset)}</p>
          </article>

          <article className="rounded-xl border border-border bg-background p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Liabilities</p>
              <TrendingDown className="size-4 text-red-600" aria-hidden />
            </div>
            <p className="font-headings text-3xl font-bold">{currencyFormat.format(totals.liability)}</p>
          </article>

          <article className="rounded-xl border border-border bg-background p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equity</p>
              <BarChart3 className="size-4 text-sky-600" aria-hidden />
            </div>
            <p className="font-headings text-3xl font-bold">{currencyFormat.format(totals.equity)}</p>
          </article>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-background shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
          <header className="border-b border-border p-6">
            <h2 className="font-headings text-lg font-bold">Financial Ledger</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {entries.map((entry) => (
                  <tr key={entry.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{entry.name}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${typePill(entry.entryType)}`}>
                        {entry.entryType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{entry.category}</td>
                    <td className="px-6 py-4 font-semibold">{currencyFormat.format(entry.amount)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{dateFormat.format(new Date(entry.recordedAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
