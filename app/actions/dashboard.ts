"use server";

import { fetchChartSeries, fetchDashboardData } from "../lib/admin-data";

export async function getDashboardDataAction() {
  return fetchDashboardData();
}

export async function getChartSeriesAction(limit = 6) {
  return fetchChartSeries(limit);
}
