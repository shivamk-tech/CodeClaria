import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import ConnectRepo from "@/model/connectRepo.model";
import User from "@/model/user.model";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const installationId = searchParams.get("installation_id");
    const setupAction = searchParams.get("setup_action");

    console.log(`\n✅ GitHub App callback`);
    console.log(`   installation_id: ${installationId}`);
    console.log(`   setup_action: ${setupAction}`);

    if (!installationId) {
      return NextResponse.redirect(new URL("/dashboard?error=no_installation", req.url));
    }

    const session = await getServerSession(authOption);
    if (session?.user) {
      await connectDb();
      const user = await User.findOne({ githubId: session.user.id });
      if (user) {
        // update all repos for this user with the installationId
        await ConnectRepo.updateMany(
          { userId: user._id },
          { installationId, isActive: true }
        );
      }
    }

    return NextResponse.redirect(new URL("/dashboard?connected=true", req.url));
  } catch (error: any) {
    console.error("GitHub callback error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=callback_failed", req.url));
  }
}
