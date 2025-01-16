import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";

const LOG_DIR = path.join(process.cwd(), "logs");

// Initialize log directory
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (error) {
  console.error("Failed to create logs directory:", error);
}

export async function GET(request: Request) {
  const headersList = headers();
  const host = headersList.get("host") || "";

  // Only allow access from localhost in development
  if (process.env.NODE_ENV !== "development" || !host.includes("localhost")) {
    return new NextResponse("Not available", { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (filePath) {
      // Read specific file
      const fullPath = path.join(LOG_DIR, path.basename(filePath));
      if (!fs.existsSync(fullPath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n").filter(Boolean);
      const maxLines = parseInt(searchParams.get("maxLines") || "1000");

      return NextResponse.json({
        content: lines.slice(-maxLines).join("\n"),
      });
    } else {
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
    }
  } catch (error) {
    console.error("Error handling log files:", error);
    return NextResponse.json(
      { error: "Failed to handle log files" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const headersList = headers();
  const host = headersList.get("host") || "";

  // Only allow access from localhost in development
  if (process.env.NODE_ENV !== "development" || !host.includes("localhost")) {
    return new NextResponse("Not available", { status: 403 });
  }

  try {
    const { entry } = await request.json();
    const logDate = new Date().toISOString().split("T")[0];
    const logFile = path.join(LOG_DIR, `app-${logDate}.log`);

    const formattedLog = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${
      entry.message
    }${entry.data ? `\nData: ${JSON.stringify(entry.data, null, 2)}` : ""}${
      entry.error ? `\nError: ${entry.error.stack || entry.error.message}` : ""
    }\n`;

    fs.appendFileSync(logFile, formattedLog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing to log file:", error);
    return NextResponse.json(
      { error: "Failed to write to log file" },
      { status: 500 }
    );
  }
}
