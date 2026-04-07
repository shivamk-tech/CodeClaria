import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import ConnectRepo from "@/model/connectRepo.model";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoFullName, name, description } = await req.json();
    if (!repoFullName || !name) {
      return NextResponse.json({ error: "repoFullName and name are required" }, { status: 400 });
    }

    await connectDb();

    const user = await User.findOne({ githubId: session.user.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check if already connected
    const existing = await ConnectRepo.findOne({ userId: user._id, repoFullName });
    if (existing) {
      return NextResponse.json({ error: "Repo already connected" }, { status: 409 });
    }

    const connected = await ConnectRepo.create({
      userId: user._id,
      repoFullName,
      name,
      description: description || "",
      isActive: true,
    });

    return NextResponse.json({ success: true, repo: connected });
  } catch (error: any) {
    console.error("Connect repo error:", error);
    return NextResponse.json({ error: error?.message || "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOption);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const user = await User.findOne({ githubId: session.user.id });
    if (!user) {
      return NextResponse.json({ repos: [] });
    }

    const repos = await ConnectRepo.find({ userId: user._id, isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ repos });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Something went wrong" }, { status: 500 });
  }
}
