import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { template: string } }
) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    `${params.template}.json`
  );

  if (!fs.existsSync(templatePath)) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const templateContent = fs.readFileSync(templatePath, "utf8");
  return NextResponse.json(JSON.parse(templateContent));
}
