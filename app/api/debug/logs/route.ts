import { logger } from "../../../lib/logger";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = headers();
    const host = headersList.get("host") || "";

    // Only allow access from localhost in development
    if (process.env.NODE_ENV !== "development" || !host.includes("localhost")) {
      return new NextResponse("Not available", { status: 403 });
    }

    const summary = logger.getLogSummary();
    const errorLogs = logger.getLogs("error");

    return NextResponse.json({
      summary,
      errorLogs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve logs",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
