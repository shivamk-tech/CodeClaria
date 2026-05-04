import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import ConnectedRepo from "@/model/connectedRepo.model";

export async function GET() {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) return Response.json({ installed: false, repos: [] });

  try {
    await connectDb();
    const record = await ConnectedRepo.findOne({ githubId: session.user.id });
    return Response.json({
      installed: !!record,
      repos: record?.repos || [],
      repoSelection: record?.repoSelection || null,
    });
  } catch {
    return Response.json({ installed: false, repos: [] });
  }
}
