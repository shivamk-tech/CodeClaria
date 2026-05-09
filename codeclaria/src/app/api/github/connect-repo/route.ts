import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import ConnectedRepo from "@/model/connectedRepo.model";
import { canConnectRepo, trackRepoConnection } from "@/services/limitService";
import { Octokit } from "@octokit/rest";

export async function POST(req: Request) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { repoFullName, enable } = await req.json();
  if (!repoFullName) return Response.json({ error: "repoFullName required" }, { status: 400 });

  await connectDb();

  const record = await ConnectedRepo.findOne({ githubId: session.user.id });
  if (!record) return Response.json({ error: "GitHub App not installed" }, { status: 404 });

  if (enable) {
    // check if repo is private via GitHub API
    let isPrivate = false;
    try {
      const octokit = new Octokit({ auth: session.accessToken });
      const [owner, repo] = repoFullName.split("/");
      const { data } = await octokit.repos.get({ owner, repo });
      isPrivate = data.private;
    } catch {}

    // check limit
    const { allowed, reason } = await canConnectRepo(session.user.id, isPrivate);
    if (!allowed) return Response.json({ error: reason, limitReached: true }, { status: 403 });

    await ConnectedRepo.updateOne(
      { githubId: session.user.id },
      { $addToSet: { repos: repoFullName } }
    );
    await trackRepoConnection(session.user.id, repoFullName, isPrivate);
  } else {
    await ConnectedRepo.updateOne(
      { githubId: session.user.id },
      { $pull: { repos: repoFullName } }
    );
  }

  return Response.json({ success: true, enabled: enable });
}
