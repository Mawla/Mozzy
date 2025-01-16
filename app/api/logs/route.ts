import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json();
    const logDir = join(process.cwd(), "logs");
    const logFile = join(
      logDir,
      `app-${new Date().toISOString().split("T")[0]}.log`
    );

    // Ensure log directory exists
    await writeFile(logFile, JSON.stringify(logEntry) + "\n", { flag: "a" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to write log:", error);
    return NextResponse.json({ error: "Failed to write log" }, { status: 500 });
  }
}
