import {
  ArrowRight,
  Bell,
  ChevronDown,
  Hammer,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminSidebar } from "../components/admin-sidebar";
import { AdminSearchInput } from "./admin-search-input";
import { PipelineBoard } from "./pipeline-board";
import { RecentActivitySection } from "./recent-activity-section";
import { fetchDashboardData, fetchPipelineBoardData, type PipelineLead } from "../lib/admin-data";

export const revalidate = 30;
export const metadata: Metadata = {
  title: "Admin Dashboard | Verdant & Stone",
  description: "Track lead performance, pipeline movement, and client activity.",
};

type PipelineColumn = {
  key: "new" | "contacted" | "site_visit_scheduled" | "quote_sent" | "negotiation";
  name: string;
  borderClass: string;
};

const pipelineColumns: PipelineColumn[] = [
  { key: "new", name: "New Request", borderClass: "border-primary" },
  { key: "contacted", name: "Contacted", borderClass: "border-accent" },
  { key: "site_visit_scheduled", name: "Site Visit Scheduled", borderClass: "border-amber-500" },
  { key: "quote_sent", name: "Quote Sent", borderClass: "border-muted-foreground" },
  { key: "negotiation", name: "Negotiation", borderClass: "border-red-500" },
];

const numberFormat = new Intl.NumberFormat("en-US");
const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
function deltaBadgeClass(value: number) {
  return value >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";
}

function sparklinePath(points: number[]) {
  if (points.length <= 1) return "M0 15 L100 15";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 28 - ((point - min) / range) * 23;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function leadHeat(value: number): "Hot" | "Warm" | "Cold" {
  if (value >= 15000) return "Hot";
  if (value >= 8000) return "Warm";
  return "Cold";
}

function heatClasses(heat: ReturnType<typeof leadHeat>) {
  if (heat === "Hot") return "bg-red-100 text-red-700";
  if (heat === "Warm") return "bg-amber-100 text-amber-700";
  return "bg-sky-100 text-sky-700";
}

function StatCard({
  label,
  value,
  delta,
  trend,
  points,
}: {
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  points: number[];
}) {
  return (
    <article className="flex h-[140px] flex-col justify-between rounded-xl border border-border bg-background p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${deltaBadgeClass(delta)}`}>
          {trend === "up" ? <TrendingUp className="size-3" aria-hidden /> : <TrendingDown className="size-3" aria-hidden />}
          {`${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="font-headings text-2xl font-bold tracking-tight">{value}</h2>
        <svg
          viewBox="0 0 100 30"
          className={`h-8 w-16 fill-none stroke-2 ${trend === "up" ? "stroke-emerald-500" : "stroke-red-500"}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={sparklinePath(points)} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </article>
  );
}

function PipelineLeadCard({ lead }: { lead: PipelineLead }) {
  const heat = leadHeat(lead.value);
  return (
    <article className="min-w-[260px] rounded-lg border border-border bg-background p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">{lead.initials}</div>
          <div>
            <h5 className="text-sm font-semibold leading-tight">{lead.client}</h5>
            <p className="text-xs font-medium text-muted-foreground">{lead.project}</p>
          </div>
        </div>
        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${heatClasses(heat)}`}>{heat}</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-bold">{currencyFormat.format(lead.value)}</span>
        <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-muted-foreground">
          <Hammer className="size-3.5" aria-hidden />
        </div>
      </div>
    </article>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; tab?: string; q?: string }> | { page?: string; tab?: string; q?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const tab = resolvedSearchParams?.tab === "pipeline" ? "pipeline" : "overview";
  const searchQuery = resolvedSearchParams?.q?.trim() ?? "";
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? "1") || 1);
  const pageSize = 5;
  const data = tab === "overview" ? await fetchDashboardData(page, pageSize, searchQuery) : null;
  const board = tab === "pipeline" ? await fetchPipelineBoardData() : null;
  const sharedSeries = data && data.sparklineSeries.length > 0 ? data.sparklineSeries : [0, 1];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <a
        href="#admin-main"
        className="fixed left-4 top-0 z-[100] -translate-y-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-transform focus:translate-y-4"
      >
        Skip to main content
      </a>

      <AdminSidebar activeItem={tab === "pipeline" ? "pipeline" : "dashboard"} />

      <div className="flex w-full flex-1 flex-col md:pl-20">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 shadow-sm backdrop-blur md:px-6">
          <div className="hidden min-w-[170px] lg:block">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Admin</p>
            <p className="font-headings text-base font-semibold">{tab === "pipeline" ? "Sales Pipeline" : "Business Dashboard"}</p>
          </div>
          <AdminSearchInput defaultQuery={searchQuery} tab={tab} />
          <div className="ml-2 hidden items-center gap-3 sm:flex">
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" aria-hidden />
              New Lead
              <ChevronDown className="size-4 opacity-70" aria-hidden />
            </button>
          </div>
        </header>

        <main id="admin-main" className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-[1400px]">
            {tab === "pipeline" && board ? <PipelineBoard initialBoard={board} /> : null}

            {tab === "overview" && data ? (
              <>
            <section className="mb-8">
              <h1 className="mb-2 font-headings text-3xl font-bold tracking-tight">Business Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor revenue, conversion trends, and pipeline health in real time.</p>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Revenue"
                value={currencyFormat.format(data.revenueValue)}
                delta={data.revenueDelta}
                trend={data.revenueDelta >= 0 ? "up" : "down"}
                points={sharedSeries}
              />
              <StatCard
                label="Active Leads"
                value={numberFormat.format(data.activeLeads)}
                delta={data.activeLeadsDelta}
                trend={data.activeLeadsDelta >= 0 ? "up" : "down"}
                points={sharedSeries}
              />
              <StatCard
                label="Conversion Rate"
                value={`${data.conversionRate.toFixed(1)}%`}
                delta={data.conversionDelta}
                trend={data.conversionDelta >= 0 ? "up" : "down"}
                points={sharedSeries}
              />
              <StatCard
                label="Avg Project Value"
                value={currencyFormat.format(data.avgProjectValue)}
                delta={data.avgProjectValueDelta}
                trend={data.avgProjectValueDelta >= 0 ? "up" : "down"}
                points={sharedSeries}
              />
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-headings text-lg font-bold">Active Pipeline</h3>
                <Link
                  href="/admin?tab=pipeline"
                  prefetch={false}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  View All
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4">
                {pipelineColumns.map((column) => (
                  <section key={column.key} className="w-[280px] shrink-0 rounded-lg bg-secondary/50 p-3">
                    <header className={`mb-4 flex items-center justify-between border-b-2 pb-2 ${column.borderClass}`}>
                      <h4 className="text-sm font-semibold uppercase tracking-wide">{column.name}</h4>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                        {data.pipeline[column.key].count}
                      </span>
                    </header>
                    <div className="flex flex-col gap-4">
                      {data.pipeline[column.key].leads.map((lead, index) => (
                        <PipelineLeadCard key={`${column.key}-${lead.id}-${index}`} lead={lead} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <RecentActivitySection
              leads={data.recentLeads}
              page={page}
              pageSize={pageSize}
              total={data.recentLeadsTotal}
              searchQuery={searchQuery}
            />
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
