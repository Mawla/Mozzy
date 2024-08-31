import { NextResponse } from "next/server";
import { AnthropicHelper } from "@/utils/AnthropicHelper";

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const { transcript, templates } = await req.json();

      const chosenTemplateId = await AnthropicHelper.chooseAppropriateTemplate(
        transcript,
        templates
      );

      return NextResponse.json({ chosenTemplateId });
    } catch (error) {
      console.error("Error choosing template:", error);
      return NextResponse.json(
        { error: "Failed to choose template" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
