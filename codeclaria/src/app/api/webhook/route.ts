import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/lib/db";
import ConnectRepo from "@/model/connectRepo.model";
import { triggerPRReview } from "@/services/prReviewService";

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
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody.toString("utf-8"));

    console.log(`\n📦 GitHub Event: ${event}`);
    console.log(`   Action: ${payload.action}`);
    console.log(`   Repo: ${payload.repository?.full_name}`);

    // installation event
    if (event === "installation") {
      await connectDb();

      if (payload.action === "created") {
        const installationId = payload.installation.id.toString();
        const repos = payload.repositories || [];
        console.log(`✅ App installed on ${repos.length} repos`);

        for (const repo of repos) {
          await ConnectRepo.findOneAndUpdate(
            { repoFullName: repo.full_name },
            { installationId, isActive: true },
            { upsert: true, new: true }
          );
        }
      }

      if (payload.action === "deleted") {
        const installationId = payload.installation.id.toString();
        await ConnectRepo.updateMany({ installationId }, { isActive: false });
        console.log(`❌ App uninstalled — installation ${installationId} deactivated`);
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
