import { NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");

// Ensure log directory exists
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create logs directory:", err);
}

export async function POST(request: Request) {
  console.debug("Received log request");

  // Only allow requests from localhost in development
  const headersList = headers();
  const host = headersList.get("host") || "";
  if (process.env.NODE_ENV === "development" && !host.includes("localhost")) {
    console.debug("Rejected non-localhost request in development");
    return new NextResponse(null, { status: 403 });
  }

  try {
    const logEntry = await request.json();
    console.debug("Received log entry:", logEntry);

    const today = new Date().toISOString().split("T")[0];
    const logFile = path.join(LOG_DIR, `app-${today}.log`);
    console.debug("Writing to log file:", logFile);

    // Format the log entry
    const formattedLog = `[${
      logEntry.timestamp
    }] ${logEntry.level.toUpperCase()}: ${logEntry.message}${
      logEntry.data ? " " + JSON.stringify(logEntry.data) : ""
    }${logEntry.error ? " " + JSON.stringify(logEntry.error) : ""}\n`;

    // Append to log file
    fs.appendFileSync(logFile, formattedLog);
    console.debug("Successfully wrote to log file");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to write log:", err);
    // Return more detailed error
    return NextResponse.json(
      {
        error: "Failed to write log",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Only allow requests from localhost in development
  const headersList = headers();
  const host = headersList.get("host") || "";
  if (process.env.NODE_ENV === "development" && !host.includes("localhost")) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const logFilePath = url.searchParams.get("path");
    const maxLines = parseInt(url.searchParams.get("maxLines") || "50", 10);

    if (logFilePath) {
      // Read specific log file
      const logFile = path.join(LOG_DIR, logFilePath);
      if (!fs.existsSync(logFile)) {
        return NextResponse.json(
          { error: "Log file not found" },
          { status: 404 }
        );
      }

      const content = fs.readFileSync(logFile, "utf-8");
      const lines = content.split("\n").filter(Boolean);
      return NextResponse.json({
        content: lines.slice(-maxLines),
      });
    }

    // List all log files
    const files = fs
      .readdirSync(LOG_DIR)
      .filter((file) => file.endsWith(".log"))
      .map((file) => {
        const filePath = path.join(LOG_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
        };
      })
      .sort((a, b) => b.created.getTime() - a.created.getTime());

    return NextResponse.json({ files });
  } catch (err) {
    console.error("Failed to retrieve logs:", err);
    return NextResponse.json(
      { error: "Failed to retrieve logs" },
      { status: 500 }
    );
  }
}
