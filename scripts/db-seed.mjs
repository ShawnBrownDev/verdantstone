import { neon } from "@neondatabase/serverless";
import { loadProjectEnv } from "./load-env.mjs";

const services = [
  "Luxury Hardscaping",
  "Outdoor Kitchen",
  "Water Feature",
  "Retaining Wall",
  "Landscape Design",
  "Lawn Care Package",
];

const leadNames = [
  "John Doe",
  "Alice Smith",
  "Mark Russo",
  "Linda Wu",
  "Tom Baker",
  "Sarah Jenkins",
  "Michael Chen",
  "Robert Smith",
  "Elena Rodriguez",
  "David Miller",
  "Noah Bennett",
  "Ava Peterson",
  "Mason Flores",
  "Isabella Torres",
  "Logan Price",
  "Emma Rivera",
  "James Watson",
  "Sofia Diaz",
  "Lucas Reed",
  "Mia Griffin",
  "Ethan Walsh",
  "Amelia Cox",
  "Benjamin Hart",
  "Harper Stone",
  "Henry Brooks",
  "Scarlett Hayes",
  "Jack Bryant",
  "Luna Ford",
];

const leadStatuses = [
  "new",
  "contacted",
  "site_visit_scheduled",
  "quote_sent",
  "negotiation",
  "booked",
  "won",
];

function getEmail(name) {
  return `${name.toLowerCase().replaceAll(" ", ".")}@example.com`;
}

function getPhone(index) {
  return `(555) 01${String(index).padStart(2, "0")}-${String(1000 + index).slice(-4)}`;
}

function firstDayOfMonthOffset(offset) {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 10);
}

async function run() {
  loadProjectEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  const sql = neon(databaseUrl);

  await sql`TRUNCATE TABLE financial_entries, analytics_summary, reviews, payments, bookings, leads RESTART IDENTITY CASCADE`;

  for (let index = 0; index < leadNames.length; index += 1) {
    const name = leadNames[index];
    const status = leadStatuses[index % leadStatuses.length];
    const service = services[index % services.length];
    const budget = 5000 + index * 1750;
    const createdAt = new Date(Date.now() - index * 86400000 * 2).toISOString();

    await sql`
      INSERT INTO leads (name, email, phone, service, budget, status, created_at)
      VALUES (${name}, ${getEmail(name)}, ${getPhone(index + 1)}, ${service}, ${budget}, ${status}, ${createdAt})
    `;
  }

  const bookingRows = [
    ["Sarah Jenkins", "Luxury Hardscaping", 7, "scheduled"],
    ["Michael Chen", "Outdoor Kitchen", 14, "scheduled"],
    ["Robert Smith", "Lawn Care Package", 4, "completed"],
    ["Elena Rodriguez", "Water Feature", 21, "scheduled"],
    ["David Miller", "Retaining Wall", 10, "cancelled"],
    ["Ava Peterson", "Landscape Design", 16, "completed"],
  ];

  for (const [customerName, service, dayOffset, status] of bookingRows) {
    const scheduledDate = new Date(Date.now() + Number(dayOffset) * 86400000).toISOString().slice(0, 10);
    await sql`
      INSERT INTO bookings (customer_name, service, scheduled_date, status, created_at)
      VALUES (${customerName}, ${service}, ${scheduledDate}, ${status}, NOW())
    `;
  }

  const paymentRows = [
    ["Sarah Jenkins", 24000, "paid"],
    ["Michael Chen", 17500, "pending"],
    ["Robert Smith", 1200, "paid"],
    ["Elena Rodriguez", 9000, "paid"],
    ["David Miller", 4500, "failed"],
    ["Ava Peterson", 13200, "paid"],
    ["James Watson", 8800, "refunded"],
    ["Sofia Diaz", 15600, "paid"],
  ];

  for (const [customerName, amount, status] of paymentRows) {
    await sql`
      INSERT INTO payments (customer_name, amount, status, created_at)
      VALUES (${customerName}, ${amount}, ${status}, NOW())
    `;
  }

  const reviewRows = [
    ["Sarah Jenkins", 5, "Outstanding craftsmanship and communication."],
    ["Michael Chen", 4, "Great design guidance and clean execution."],
    ["Robert Smith", 5, "Fast turnaround and very professional crew."],
    ["Elena Rodriguez", 5, "Our new water feature looks incredible."],
    ["David Miller", 4, "Quality work, minor scheduling delay."],
    ["Ava Peterson", 5, "Exactly what we envisioned for our patio."],
  ];

  for (const [customerName, rating, comment] of reviewRows) {
    await sql`
      INSERT INTO reviews (customer_name, rating, comment, created_at)
      VALUES (${customerName}, ${rating}, ${comment}, NOW())
    `;
  }

  const analyticsRows = [
    { monthOffset: -5, leads: 32, bookings: 9, revenue: 74200 },
    { monthOffset: -4, leads: 36, bookings: 11, revenue: 81100 },
    { monthOffset: -3, leads: 39, bookings: 12, revenue: 92350 },
    { monthOffset: -2, leads: 42, bookings: 14, revenue: 99800 },
    { monthOffset: -1, leads: 46, bookings: 16, revenue: 110500 },
    { monthOffset: 0, leads: 51, bookings: 18, revenue: 124500 },
  ];

  for (const row of analyticsRows) {
    await sql`
      INSERT INTO analytics_summary (month, leads, bookings, revenue)
      VALUES (${firstDayOfMonthOffset(row.monthOffset)}, ${row.leads}, ${row.bookings}, ${row.revenue})
      ON CONFLICT (month)
      DO UPDATE SET leads = EXCLUDED.leads, bookings = EXCLUDED.bookings, revenue = EXCLUDED.revenue
    `;
  }

  const financialEntryRows = [
    ["asset", "Operating Cash", "Cash & Equivalents", 1450000, "2026-04-01"],
    ["asset", "Accounts Receivable", "Receivables", 245000, "2026-04-01"],
    ["asset", "Inventory & Supplies", "Inventory", 180000, "2026-04-01"],
    ["asset", "Fleet Equipment", "Fixed Assets", 980000, "2026-04-01"],
    ["liability", "Accounts Payable", "Current Liabilities", 210000, "2026-04-01"],
    ["liability", "Short-Term Debt", "Current Liabilities", 120000, "2026-04-01"],
    ["liability", "Equipment Financing", "Long-Term Liabilities", 90000, "2026-04-01"],
    ["equity", "Owner's Capital", "Owner Equity", 1030000, "2026-04-01"],
    ["equity", "Retained Earnings", "Owner Equity", 215000, "2026-04-01"],
  ];

  for (const [entryType, name, category, amount, recordedAt] of financialEntryRows) {
    await sql`
      INSERT INTO financial_entries (entry_type, name, category, amount, recorded_at)
      VALUES (${entryType}, ${name}, ${category}, ${amount}, ${recordedAt})
    `;
  }

  console.log("Seed complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
