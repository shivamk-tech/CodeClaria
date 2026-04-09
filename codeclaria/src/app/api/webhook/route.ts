import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { triggerPRReview } from "@/services/prReviewService";
import { triggerCommitReview } from "@/services/commitReviewService";
import connectDb from "@/lib/db";
import ConnectedRepo from "@/model/connectedRepo.model";

function verifySignature(payload: Buffer, signature: string): boolean {
  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("❌ GITHUB_APP_WEBHOOK_SECRET is not set");
    return false;
  }
  if (!signature) {
    console.error("❌ No signature in request");
    return false;
  }
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(payload).digest("hex")}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // read as arrayBuffer to get exact raw bytes — critical for signature verification
    const arrayBuffer = await req.arrayBuffer();
    const rawBody = Buffer.from(arrayBuffer);
    const signature = req.headers.get("x-hub-signature-256") || "";
    const event = req.headers.get("x-github-event") || "";

    if (!verifySignature(rawBody, signature)) {
      console.error("❌ Invalid webhook signature");
      console.error("   Event:", event);
      console.error("   Signature received:", signature?.slice(0, 20) + "...");
      console.error("   Secret set:", !!process.env.GITHUB_APP_WEBHOOK_SECRET);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody.toString("utf-8"));

    console.log(`\n📦 GitHub Event: ${event}`);
    console.log(`   Action: ${payload.action}`);
    console.log(`   Repo: ${payload.repository?.full_name}`);

    // installation event — save to ConnectedRepo
    if (event === "installation") {
      const senderId = payload.sender?.id?.toString();
      const installationId = payload.installation?.id;
      const accountLogin = payload.installation?.account?.login;
      const accountType = payload.installation?.account?.type;
      const repoSelection = payload.installation?.repository_selection;
      const repos = (payload.repositories || []).map((r: any) => r.full_name);

      if (senderId && installationId) {
        await connectDb();
        if (payload.action === "created") {
          await ConnectedRepo.findOneAndUpdate(
            { githubId: senderId },
            { installationId, accountLogin, accountType, repoSelection, repos },
            { upsert: true, new: true }
          );
          console.log(`✅ ConnectedRepo saved for ${accountLogin} (installationId: ${installationId})`);
        } else if (payload.action === "deleted") {
          await ConnectedRepo.deleteOne({ githubId: senderId });
          console.log(`🗑️ ConnectedRepo removed for ${accountLogin}`);
        }
      }
    }

    // installation_repositories — update repo list
    if (event === "installation_repositories") {
      const senderId = payload.sender?.id?.toString();
      const added = (payload.repositories_added || []).map((r: any) => r.full_name);
      const removed = (payload.repositories_removed || []).map((r: any) => r.full_name);
      if (senderId) {
        await connectDb();
        if (added.length) await ConnectedRepo.updateOne({ githubId: senderId }, { $addToSet: { repos: { $each: added } } });
        if (removed.length) await ConnectedRepo.updateOne({ githubId: senderId }, { $pull: { repos: { $in: removed } } });
        console.log(`🔄 Repos updated for user ${senderId}`);
      }
    }

    // push event — review commits pushed to main
    if (event === "push") {
      const { commits, ref, installation } = payload;
      if (!installation) {
        console.log("⏭️  Push event has no installation — skipping");
      } else if (!commits || commits.length === 0) {
        console.log("⏭️  Push event has no commits — skipping");
      } else {
        console.log(`\n📤 Push to ${ref} — ${commits.length} commit(s)`);
        triggerCommitReview({ commits, repository: payload.repository, installation, ref });
      }
    }

    // PR event
    if (event === "pull_request") {
      const { action, pull_request, repository, installation } = payload;

      if (action === "opened" || action === "synchronize") {
        console.log(`\n🔀 PR ${action}: #${pull_request.number} — ${pull_request.title}`);
        console.log(`   Repo: ${repository.full_name}`);
        console.log(`   Branch: ${pull_request.head.ref} → ${pull_request.base.ref}`);
        console.log(`   Diff URL: ${pull_request.diff_url}`);

        // trigger AI review async — don't await so webhook returns fast
        triggerPRReview({ pull_request, repository, installation });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
