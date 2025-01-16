import { logger } from "../../../lib/logger";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const headersList = headers();
  const host = headersList.get("host") || "";

  // Only allow access from localhost in development
  if (process.env.NODE_ENV !== "development" || !host.includes("localhost")) {
    return new NextResponse("Not available", { status: 403 });
  }

  try {
    const summary = logger.getLogSummary();
    const errorLogs = logger.getLogs("error");
    const logFiles = logger.getLogFiles();

    return NextResponse.json({
      summary,
      errorLogs,
      logFiles,
      currentLogFile: logger.getLogFilePath(),
    });
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve logs" },
      { status: 500 }
    );
  }
}
