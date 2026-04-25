"use server";

import { createLead, type LeadStatus, type NewLeadInput, updateLeadStatus } from "../lib/admin-data";

export async function createLeadAction(input: NewLeadInput) {
  if (
    !input.name?.trim() ||
    !input.email?.trim() ||
    !input.phone?.trim() ||
    !input.service?.trim() ||
    Number.isNaN(input.budget) ||
    input.budget <= 0
  ) {
    throw new Error("Missing required lead fields.");
  }
  return createLead(input);
}

export async function updateLeadStatusAction(id: number, status: LeadStatus) {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid lead id.");
  }
  return updateLeadStatus(id, status);
}
