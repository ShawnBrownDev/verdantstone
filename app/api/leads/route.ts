import { NextResponse } from "next/server";
import { createLeadAction } from "@/app/actions/leads";
import { getSql } from "@/app/lib/db";

export async function GET() {
  const sql = getSql();
  const leads = await sql<{
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    budget: number;
    status: string;
    created_at: string;
  }[]>`
    SELECT id, name, email, phone, service, budget, status, created_at::text AS created_at
    FROM leads
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      budget?: number;
      status?: "new" | "contacted" | "site_visit_scheduled" | "quote_sent" | "negotiation" | "booked" | "won";
    };

    const budget = Number(body.budget ?? 0);
    const created = await createLeadAction({
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      service: String(body.service ?? "").trim(),
      budget,
      status: body.status,
    });

    return NextResponse.json({ ok: true, leadId: created.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create lead." },
      { status: 400 },
    );
  }
}
