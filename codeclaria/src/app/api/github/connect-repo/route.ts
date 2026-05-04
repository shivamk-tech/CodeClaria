import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import ConnectedRepo from "@/model/connectedRepo.model";

export async function POST(req: Request) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { repoFullName, enable } = await req.json();
  if (!repoFullName) return Response.json({ error: "repoFullName required" }, { status: 400 });

  await connectDb();

  const record = await ConnectedRepo.findOne({ githubId: session.user.id });
  if (!record) return Response.json({ error: "GitHub App not installed" }, { status: 404 });

  if (enable) {
    await ConnectedRepo.updateOne(
      { githubId: session.user.id },
      { $addToSet: { repos: repoFullName } }
    );
  } else {
    await ConnectedRepo.updateOne(
      { githubId: session.user.id },
      { $pull: { repos: repoFullName } }
    );
  }

  return Response.json({ success: true, enabled: enable });
}
