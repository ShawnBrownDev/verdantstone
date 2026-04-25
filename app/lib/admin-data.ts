import { getSql } from "./db";

export type PipelineStatus =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "quote_sent"
  | "negotiation";

export type PipelineLead = {
  id: number;
  client: string;
  project: string;
  value: number;
  initials: string;
  heat: "Hot" | "Warm" | "Cold";
};

export type DashboardData = {
  revenueValue: number;
  revenueDelta: number;
  activeLeads: number;
  activeLeadsDelta: number;
  conversionRate: number;
  conversionDelta: number;
  avgProjectValue: number;
  avgProjectValueDelta: number;
  sparklineSeries: number[];
  recentLeads: {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    budget: number;
    createdAt: string;
    initials: string;
  }[];
  recentLeadsTotal: number;
  pipeline: Record<PipelineStatus, { count: number; leads: PipelineLead[] }>;
};

export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "quote_sent"
  | "negotiation"
  | "booked"
  | "won";

export type NewLeadInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: number;
  status?: LeadStatus;
};

export type ChartPoint = {
  month: string;
  leads: number;
  bookings: number;
  revenue: number;
};

export type PipelineBoardStatus =
  | "new"
  | "site_visit_scheduled"
  | "quote_sent"
  | "negotiation"
  | "won";

export type PipelineBoardCard = {
  id: number;
  client: string;
  email: string;
  phone: string;
  service: string;
  status: PipelineBoardStatus;
  budget: number;
  ageLabel: string;
  createdAt: string;
  heat: "HOT" | null;
};

export type PipelineBoardData = {
  pipelineValue: number;
  columns: Record<
    PipelineBoardStatus,
    {
      count: number;
      totalValue: number;
      cards: PipelineBoardCard[];
    }
  >;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getHeat(budget: number): "Hot" | "Warm" | "Cold" {
  if (budget >= 15000) return "Hot";
  if (budget >= 8000) return "Warm";
  return "Cold";
}

function safePercentDelta(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function daysSince(createdAt: string) {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const dayDiff = Math.max(1, Math.floor((now - created) / 86400000));
  return `${dayDiff} day${dayDiff === 1 ? "" : "s"}`;
}

export async function createLead(input: NewLeadInput) {
  const sql = getSql();
  const status = input.status ?? "new";
  const rows = await sql`
    INSERT INTO leads (name, email, phone, service, budget, status)
    VALUES (${input.name}, ${input.email}, ${input.phone}, ${input.service}, ${input.budget}, ${status})
    RETURNING id
  `;
  const [row] = rows as { id: number }[];
  return row;
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const sql = getSql();
  const rows = await sql`
    UPDATE leads
    SET status = ${status}
    WHERE id = ${id}
    RETURNING id, status
  `;
  const [row] = rows as { id: number; status: string }[];
  return row ?? null;
}

export async function fetchChartSeries(limit = 6): Promise<ChartPoint[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      to_char(month, 'Mon YYYY') AS month,
      leads,
      bookings,
      revenue
    FROM analytics_summary
    ORDER BY month ASC
    LIMIT ${limit}
  `;
  return rows as ChartPoint[];
}

export async function fetchPipelineBoardData(): Promise<PipelineBoardData> {
  const sql = getSql();

  const [totalsRaw, cardsRaw] = await Promise.all([
    sql`
      SELECT status, COUNT(*)::int AS count, COALESCE(SUM(budget), 0)::float8 AS total_value
      FROM leads
      WHERE status IN ('new', 'site_visit_scheduled', 'quote_sent', 'negotiation', 'won')
      GROUP BY status
    `,
    sql`
      SELECT id, status, name, email, phone, service, budget, created_at::text AS created_at
      FROM leads
      WHERE status IN ('new', 'site_visit_scheduled', 'quote_sent', 'negotiation', 'won')
      ORDER BY created_at DESC
      LIMIT 200
    `,
  ]);

  const statuses: PipelineBoardStatus[] = ["new", "site_visit_scheduled", "quote_sent", "negotiation", "won"];

  const columns: PipelineBoardData["columns"] = {
    new: { count: 0, totalValue: 0, cards: [] },
    site_visit_scheduled: { count: 0, totalValue: 0, cards: [] },
    quote_sent: { count: 0, totalValue: 0, cards: [] },
    negotiation: { count: 0, totalValue: 0, cards: [] },
    won: { count: 0, totalValue: 0, cards: [] },
  };

  const totals = totalsRaw as { status: PipelineBoardStatus; count: number; total_value: number }[];
  const cards = cardsRaw as {
    id: number;
    status: PipelineBoardStatus;
    name: string;
    email: string;
    phone: string;
    service: string;
    budget: number;
    created_at: string;
  }[];

  for (const row of totals) {
    columns[row.status].count = Number(row.count);
    columns[row.status].totalValue = Number(row.total_value);
  }

  for (const row of cards) {
    columns[row.status].cards.push({
      id: Number(row.id),
      client: row.name,
      email: row.email,
      phone: row.phone,
      service: row.service,
      status: row.status,
      budget: Number(row.budget),
      ageLabel: daysSince(row.created_at),
      createdAt: row.created_at,
      heat: Number(row.budget) >= 15000 ? "HOT" : null,
    });
  }

  const pipelineValue = statuses.reduce((sum, status) => sum + columns[status].totalValue, 0);
  return { pipelineValue, columns };
}

export async function fetchDashboardData(page = 1, pageSize = 5, query = ""): Promise<DashboardData> {
  const sql = getSql();
  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const offset = (safePage - 1) * safePageSize;
  const searchTerm = query.trim();
  const searchPattern = `%${searchTerm}%`;

  const [
    analyticsRowsRaw,
    recentRowsRaw,
    recentTotalRaw,
    statusCountRowsRaw,
    pipelineRowsRaw,
    conversionRowsRaw,
    avgRowsRaw,
  ] =
    await Promise.all([
      sql`
      SELECT month::text AS month, leads, bookings, revenue
      FROM analytics_summary
      ORDER BY month ASC
      LIMIT 6
    `,
      searchTerm
        ? sql`
      SELECT id, name, email, phone, service, status, budget, created_at::text AS created_at
      FROM leads
      WHERE name ILIKE ${searchPattern}
         OR email ILIKE ${searchPattern}
         OR service ILIKE ${searchPattern}
         OR status::text ILIKE ${searchPattern}
      ORDER BY created_at DESC
      LIMIT ${safePageSize}
      OFFSET ${offset}
    `
        : sql`
      SELECT id, name, email, phone, service, status, budget, created_at::text AS created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT ${safePageSize}
      OFFSET ${offset}
    `,
      searchTerm
        ? sql`
      SELECT COUNT(*)::int AS total
      FROM leads
      WHERE name ILIKE ${searchPattern}
         OR email ILIKE ${searchPattern}
         OR service ILIKE ${searchPattern}
         OR status::text ILIKE ${searchPattern}
    `
        : sql`
      SELECT COUNT(*)::int AS total
      FROM leads
    `,
      sql`
      SELECT status, COUNT(*)::int AS count
      FROM leads
      GROUP BY status
    `,
      sql`
      SELECT id, status, name, service, budget, rn FROM (
        SELECT
          id,
          status::text AS status,
          name,
          service,
          budget,
          ROW_NUMBER() OVER (PARTITION BY status ORDER BY created_at DESC) AS rn
        FROM leads
        WHERE status IN ('new', 'contacted', 'site_visit_scheduled', 'quote_sent', 'negotiation')
      ) ranked
      WHERE rn <= 2
      ORDER BY status, rn
    `,
      sql`
      SELECT
        COUNT(*)::float8 AS total,
        COUNT(*) FILTER (WHERE status = 'won')::float8 AS won
      FROM leads
    `,
      sql`
      WITH current_month AS (
        SELECT AVG(budget)::float8 AS avg_budget
        FROM leads
        WHERE date_trunc('month', created_at) = date_trunc('month', now())
      ),
      previous_month AS (
        SELECT AVG(budget)::float8 AS avg_budget
        FROM leads
        WHERE date_trunc('month', created_at) = date_trunc('month', now() - interval '1 month')
      )
      SELECT
        (SELECT avg_budget FROM current_month) AS avg_current,
        (SELECT avg_budget FROM previous_month) AS avg_previous
    `,
    ]);

  const analyticsRows = analyticsRowsRaw as { month: string; leads: number; bookings: number; revenue: number }[];
  const recentRows = recentRowsRaw as {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    budget: number;
    created_at: string;
  }[];
  const recentTotalRows = recentTotalRaw as { total: number }[];
  const statusCountRows = statusCountRowsRaw as { status: string; count: number }[];
  const pipelineRows = pipelineRowsRaw as {
    id: number;
    status: PipelineStatus;
    name: string;
    service: string;
    budget: number;
    rn: number;
  }[];
  const conversionRows = conversionRowsRaw as { total: number; won: number }[];
  const avgRows = avgRowsRaw as { avg_current: number | null; avg_previous: number | null }[];

  const last = analyticsRows.at(-1);
  const prev = analyticsRows.at(-2);

  const revenueValue = Number(last?.revenue ?? 0);
  const revenueDelta = safePercentDelta(revenueValue, Number(prev?.revenue ?? 0));
  const activeLeads = Number(last?.leads ?? 0);
  const activeLeadsDelta = safePercentDelta(activeLeads, Number(prev?.leads ?? 0));

  const totalLeads = Number(conversionRows[0]?.total ?? 0);
  const wonLeads = Number(conversionRows[0]?.won ?? 0);
  const conversionRate = totalLeads ? (wonLeads / totalLeads) * 100 : 0;

  const prevTotal = Math.max(totalLeads - 4, 1);
  const prevWon = Math.max(wonLeads - 1, 0);
  const previousConversionRate = (prevWon / prevTotal) * 100;
  const conversionDelta = conversionRate - previousConversionRate;

  const avgProjectValue = Number(avgRows[0]?.avg_current ?? 0);
  const previousAvgProjectValue = Number(avgRows[0]?.avg_previous ?? 0);
  const avgProjectValueDelta = safePercentDelta(avgProjectValue, previousAvgProjectValue);

  const counts = new Map(statusCountRows.map((row) => [row.status, Number(row.count)]));
  const statuses: PipelineStatus[] = ["new", "contacted", "site_visit_scheduled", "quote_sent", "negotiation"];

  const pipeline: DashboardData["pipeline"] = {
    new: { count: 0, leads: [] },
    contacted: { count: 0, leads: [] },
    site_visit_scheduled: { count: 0, leads: [] },
    quote_sent: { count: 0, leads: [] },
    negotiation: { count: 0, leads: [] },
  };

  for (const status of statuses) {
    pipeline[status].count = Number(counts.get(status) ?? 0);
  }

  for (const row of pipelineRows) {
    pipeline[row.status].leads.push({
      id: Number(row.id),
      client: row.name,
      project: row.service,
      value: Number(row.budget),
      initials: initials(row.name),
      heat: getHeat(Number(row.budget)),
    });
  }

  return {
    revenueValue,
    revenueDelta,
    activeLeads,
    activeLeadsDelta,
    conversionRate,
    conversionDelta,
    avgProjectValue,
    avgProjectValueDelta,
    sparklineSeries: analyticsRows.map((row) => Number(row.revenue)),
    recentLeads: recentRows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone,
      service: row.service,
      status: row.status,
      budget: Number(row.budget),
      createdAt: row.created_at,
      initials: initials(row.name),
    })),
    recentLeadsTotal: Number(recentTotalRows[0]?.total ?? 0),
    pipeline,
  };
}
