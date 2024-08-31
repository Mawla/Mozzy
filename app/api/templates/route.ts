import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const templatesDir = path.join(process.cwd(), "public", "templates");
  const templates = fs
    .readdirSync(templatesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));

  return NextResponse.json(templates);
}
