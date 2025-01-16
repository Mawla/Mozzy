import { logger } from "../../../lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  // Generate some test logs
  logger.debug("Test debug message");
  logger.info("Test info message");
  logger.warn("Test warning message");
  try {
    throw new Error("Test error");
  } catch (error) {
    logger.error("Test error message", error);
  }

  const summary = logger.getLogSummary();
  const errorLogs = summary.recentErrors;

  return NextResponse.json({
    summary,
    errorLogs,
    timestamp: new Date().toISOString(),
  });
}
