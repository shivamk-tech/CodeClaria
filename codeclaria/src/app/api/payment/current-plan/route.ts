import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import Subscription from "@/model/subscription.model";

export async function GET() {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) return Response.json({ plan: "free" });

  try {
    await connectDb();
    const sub = await Subscription.findOne({ githubId: session.user.id });
    const plan = sub?.isValid() ? sub.plan : "free";
    return Response.json({ plan });
  } catch {
    return Response.json({ plan: "free" });
  }
}
