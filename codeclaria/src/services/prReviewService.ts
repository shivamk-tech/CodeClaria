import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// get an installation-scoped Octokit client
async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    installationId,
  });

  const { token } = await auth({ type: "installation" });

  return new Octokit({ auth: token });
}

// fetch PR diff from GitHub
async function fetchPRDiff(diffUrl: string): Promise<string> {
  const res = await fetch(diffUrl, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });
  const diff = await res.text();
  return diff.slice(0, 8000); // cap to stay within token limits
}

// ask Groq to review the diff
async function reviewDiffWithAI(diff: string, repoName: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `You are an expert code reviewer. Review the following PR diff for the repo "${repoName}".
Provide a concise review covering:
- What this PR does
- Any bugs or issues found
- Code quality concerns
- Suggestions for improvement
Be specific, mention exact line numbers or code snippets where relevant.
Keep it under 300 words.`,
      },
      {
        role: "user",
        content: `PR Diff:\n\`\`\`diff\n${diff}\n\`\`\``,
      },
    ],
  });

  return response.choices[0]?.message?.content || "Unable to generate review.";
}

// post review comment on the PR
async function postPRComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
): Promise<void> {
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body: `## 🤖 CodeClaria AI Review\n\n${body}\n\n---\n*Powered by CodeClaria · [View Dashboard](${process.env.NEXTAUTH_URL}/dashboard)*`,
  });
}

// main function — called from webhook
export async function triggerPRReview({
  pull_request,
  repository,
  installation,
}: {
  pull_request: any;
  repository: any;
  installation: any;
}) {
  try {
    const [owner, repo] = repository.full_name.split("/");
    const installationId = installation.id;
    const pullNumber = pull_request.number;
    const diffUrl = pull_request.diff_url;

    console.log(`\n🤖 Starting AI review for PR #${pullNumber} in ${repository.full_name}`);

    // get authenticated octokit
    const octokit = await getInstallationOctokit(installationId);

    // fetch diff
    const diff = await fetchPRDiff(diffUrl);
    console.log(`📄 Fetched diff (${diff.length} chars)`);

    // AI review
    const review = await reviewDiffWithAI(diff, repository.full_name);
    console.log(`✅ AI review generated`);

    // post comment
    await postPRComment(octokit, owner, repo, pullNumber, review);
    console.log(`💬 Review posted to PR #${pullNumber}`);

  } catch (error: any) {
    console.error("PR review error:", error?.message);
  }
}
