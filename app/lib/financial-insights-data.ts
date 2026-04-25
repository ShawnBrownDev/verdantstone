import { getSql } from "./db";

export type FinancialEntryType = "asset" | "liability" | "equity";

export type FinancialEntry = {
  id: number;
  entryType: FinancialEntryType;
  name: string;
  category: string;
  amount: number;
  recordedAt: string;
};

export type FinancialInsightsData = {
  totals: Record<FinancialEntryType, number>;
  entries: FinancialEntry[];
};

export async function fetchFinancialInsightsData(): Promise<FinancialInsightsData> {
  const sql = getSql();
  const [totalsRaw, entriesRaw] = await Promise.all([
    sql`
      SELECT entry_type, COALESCE(SUM(amount), 0)::float8 AS total
      FROM financial_entries
      GROUP BY entry_type
    `,
    sql`
      SELECT id, entry_type, name, category, amount, recorded_at::text AS recorded_at
      FROM financial_entries
      ORDER BY recorded_at DESC, id DESC
      LIMIT 50
    `,
  ]);

  const totals: FinancialInsightsData["totals"] = {
    asset: 0,
    liability: 0,
    equity: 0,
  };

  for (const row of totalsRaw as { entry_type: FinancialEntryType; total: number }[]) {
    totals[row.entry_type] = Number(row.total);
  }

  const entries = (entriesRaw as {
    id: number;
    entry_type: FinancialEntryType;
    name: string;
    category: string;
    amount: number;
    recorded_at: string;
  }[]).map((row) => ({
    id: Number(row.id),
    entryType: row.entry_type,
    name: row.name,
    category: row.category,
    amount: Number(row.amount),
    recordedAt: row.recorded_at,
  }));

  return { totals, entries };
}
