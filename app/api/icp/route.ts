import { NextRequest, NextResponse } from "next/server";
import { icpService } from "@/app/services/icpService";
import { ICP } from "@/app/types/icp";

export async function GET() {
  try {
    const icps = icpService.getICPs();
    return NextResponse.json(icps);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ICPs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const icp: ICP = await request.json();
    icpService.addICP(icp);
    return NextResponse.json({ message: "ICP added successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add ICP" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const icp: ICP = await request.json();
    icpService.updateICP(icp);
    return NextResponse.json({ message: "ICP updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update ICP" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    icpService.deleteICP(id);
    return NextResponse.json({ message: "ICP deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete ICP" },
      { status: 500 }
    );
  }
}
