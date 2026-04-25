import { NextResponse } from "next/server";
import { updateLeadStatusAction } from "@/app/actions/leads";
import type { LeadStatus } from "@/app/lib/admin-data";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: LeadStatus };
    const leadId = Number(id);
    const status = body.status;

    if (!status) {
      return NextResponse.json({ ok: false, error: "status is required" }, { status: 400 });
    }

    const updated = await updateLeadStatusAction(leadId, status);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update status." },
      { status: 400 },
    );
  }
}
