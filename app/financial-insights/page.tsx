import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { AdminSidebar } from "../components/admin-sidebar";
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

function typePill(type: FinancialEntryType) {
  if (type === "asset") return "bg-emerald-100 text-emerald-700";
  if (type === "liability") return "bg-red-100 text-red-700";
  return "bg-sky-100 text-sky-700";
}

export default async function FinancialInsightsPage() {
  const { totals, entries } = await fetchFinancialInsightsData();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar activeItem="financial-insights" />

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
