"use client";

import { Eye, Mail, MoreVertical, Phone, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DashboardData } from "../lib/admin-data";

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function statusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function badgeClasses(status: string) {
  if (status === "booked" || status === "won") return "border border-emerald-200 bg-emerald-100 text-emerald-800";
  if (status === "quote_sent") return "border border-sky-200 bg-sky-100 text-sky-800";
  if (status === "site_visit_scheduled" || status === "negotiation")
    return "border border-amber-200 bg-amber-100 text-amber-800";
  return "border border-border bg-muted text-muted-foreground";
}

export function RecentActivitySection({
  leads,
  page,
  pageSize,
  total,
  searchQuery,
}: {
  leads: DashboardData["recentLeads"];
  page: number;
  pageSize: number;
  total: number;
  searchQuery: string;
}) {
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? null, [leads, selectedLeadId]);
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const hasPrev = page > 1;
  const hasNext = page * pageSize < total;
  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set("page", String(targetPage));
    if (searchQuery) params.set("q", searchQuery);
    const query = params.toString();
    return query ? `/admin?${query}` : "/admin";
  };

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-background shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
      <header className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-headings text-lg font-bold">Recent Activity</h3>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3 font-semibold">Client</th>
              <th className="px-6 py-3 font-semibold">Service Required</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Est. Value</th>
              <th className="px-6 py-3 font-semibold">Date Added</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-muted/40">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {lead.initials}
                    </div>
                    <div>
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium">{lead.service}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClasses(lead.status)}`}>
                    {statusLabel(lead.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-semibold">{currencyFormat.format(lead.budget)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{dateFormat.format(new Date(lead.createdAt))}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-muted-foreground">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="rounded p-1.5 transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Preview ${lead.name}`}
                    >
                      <Eye className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`More options for ${lead.name}`}
                    >
                      <MoreVertical className="size-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between border-t border-border bg-background p-4 text-sm text-muted-foreground">
        <span>
          Showing {startItem} to {endItem} of {total} entries
        </span>
        <div className="flex gap-1">
          <Link
            href={hasPrev ? buildHref(page - 1) : buildHref(1)}
            scroll={false}
            prefetch={false}
            aria-disabled={!hasPrev}
            className={`rounded border border-border px-3 py-1 transition-colors ${
              hasPrev ? "bg-muted/50 hover:bg-muted" : "pointer-events-none bg-muted/20 opacity-50"
            }`}
          >
            Prev
          </Link>
          <Link
            href={buildHref(page + 1)}
            scroll={false}
            prefetch={false}
            aria-disabled={!hasNext}
            className={`rounded border border-border px-3 py-1 text-foreground transition-colors ${
              hasNext ? "bg-background hover:bg-muted" : "pointer-events-none bg-muted/20 opacity-50"
            }`}
          >
            Next
          </Link>
        </div>
      </footer>

      {selectedLead ? (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            onClick={() => setSelectedLeadId(null)}
            className="h-full flex-1 bg-black/30 backdrop-blur-[1px]"
            aria-label="Close lead details"
          />
          <aside className="h-full w-full max-w-[420px] border-l border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead Details</p>
                <h2 className="font-headings text-2xl font-bold">{selectedLead.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close panel"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Requested</p>
                  <p className="font-semibold">{selectedLead.service}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <p className="font-semibold">{statusLabel(selectedLead.status)}</p>
                </div>
              </div>
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-border p-2">
                    <Phone className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="font-semibold">{selectedLead.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-border p-2">
                    <Mail className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="font-semibold">{selectedLead.email}</p>
                </div>
              </div>
              <div className="space-y-2 border-b border-border pb-4">
                <p className="text-4xl font-bold tracking-tight">{currencyFormat.format(selectedLead.budget)}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Added {new Date(selectedLead.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
