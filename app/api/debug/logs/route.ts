import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  const summary = logger.getLogSummary();
  const logs = logger.getLogs();
  const errorLogs = logs.filter((log) => log.level === "error");

  return NextResponse.json({
    summary,
    errorLogs,
  });
}
