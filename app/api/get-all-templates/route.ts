import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "packs",
      "alltemplates.json"
    );
    console.log("File path:", filePath);

    const fileContents = await fs.readFile(filePath, "utf8");
    console.log("File contents:", fileContents.substring(0, 100) + "..."); // Log first 100 characters

    const data = JSON.parse(fileContents);
    console.log(
      "Parsed data structure:",
      JSON.stringify(data, null, 2).substring(0, 200) + "..."
    ); // Log structure

    // Ensure we're returning the templates array directly
    const templates = data.result?.data?.json || data.json || data;
    if (!Array.isArray(templates)) {
      throw new Error("Unexpected data structure in alltemplates.json");
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error reading alltemplates.json:", error);
    return NextResponse.json(
      { error: `Error fetching templates: ${error.message}` },
      { status: 500 }
    );
  }
}
