import { NextRequest, NextResponse } from "next/server";
import { ideasService } from "@/app/services/ideasService";

export async function GET() {
  try {
    const ideas = ideasService.getAllIdeas();
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    const newIdea = ideasService.createIdea(title, description);
    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
