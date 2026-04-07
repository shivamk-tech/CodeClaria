import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    installationId,
  });
  const { token } = await auth({ type: "installation" });
  return new Octokit({ auth: token });
}

interface InlineComment {
  path: string;
  position: number;
  line: number;
  comment: string;
}

// parse diff and extract changed lines with their positions
function parseDiffForLines(diff: string): { path: string; lines: { line: number; content: string; position: number }[] }[] {
  const files: { path: string; lines: { line: number; content: string; position: number }[] }[] = [];
  const fileBlocks = diff.split(/^diff --git /m).filter(Boolean);

  for (const block of fileBlocks) {
    const pathMatch = block.match(/b\/(.+?)\n/);
    if (!pathMatch) continue;
    const path = pathMatch[1].trim();

    const lines: { line: number; content: string; position: number }[] = [];
    const hunks = block.split(/^@@/m).slice(1);

    for (const hunk of hunks) {
      const hunkHeader = hunk.match(/\s*-\d+(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);
      if (!hunkHeader) continue;

      let lineNum = parseInt(hunkHeader[1]);
      let position = 1;
      const hunkLines = hunk.split("\n").slice(1);

      for (const line of hunkLines) {
        if (line.startsWith("+") && !line.startsWith("+++")) {
          lines.push({ line: lineNum, content: line.slice(1), position });
          lineNum++;
        } else if (line.startsWith("-") && !line.startsWith("---")) {
          // deleted line — don't increment lineNum
        } else if (!line.startsWith("\\")) {
          lineNum++;
        }
        position++;
      }
    }

    if (lines.length > 0) files.push({ path, lines });
  }

  return files;
}

// ask Groq to review specific lines and return inline comments
async function getInlineComments(
  files: { path: string; lines: { line: number; content: string; position: number }[] }[],
  repoName: string,
  commitMessage: string
): Promise<InlineComment[]> {

  // build context for AI
  const context = files.map((f) => {
    const linesList = f.lines.map((l) => `  Line ${l.line}: ${l.content}`).join("\n");
    return `File: ${f.path}\nAdded lines:\n${linesList}`;
  }).join("\n\n").slice(0, 6000);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `You are an expert code reviewer. Analyze the committed code changes and return inline comments as JSON.

Return ONLY a valid JSON array like this:
[
  {
    "path": "src/file.ts",
    "line": 42,
    "comment": "Your specific comment about this line"
  }
]

Rules:
- Only comment on lines that have real issues, bugs, or improvements
- Be specific and actionable
- Max 5 comments
- If code is fine, return empty array []
- Return ONLY the JSON array, no other text`,
      },
      {
        role: "user",
        content: `Repo: ${repoName}\nCommit: "${commitMessage}"\n\nChanged code:\n${context}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "[]";

  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]);

    // map line numbers to diff positions
    return parsed.map((c: any) => {
      const file = files.find((f) => f.path === c.path);
      const lineData = file?.lines.find((l) => l.line === c.line);
      return {
        path: c.path,
        line: c.line,
        position: lineData?.position || 1,
        comment: c.comment,
      };
    }).filter((c: InlineComment) => c.comment);
  } catch {
    return [];
  }
}

// post comments on a commit — as general comments mentioning file and line
async function postInlineComments(
  octokit: Octokit,
  owner: string,
  repo: string,
  commitSha: string,
  comments: InlineComment[]
): Promise<void> {
  // batch all comments into one single commit comment
  const body = comments.map((c) =>
    `**\`${c.path}\` line ${c.line}**\n> ${c.comment}`
  ).join("\n\n---\n\n");

  try {
    const res = await octokit.repos.createCommitComment({
      owner,
      repo,
      commit_sha: commitSha,
      body: `## 🤖 CodeClaria Code Review\n\n${body}\n\n---\n*Powered by [CodeClaria](${process.env.NEXTAUTH_URL})*`,
    });
    console.log(`  ✅ Review posted: ${res.data.html_url}`);
  } catch (err: any) {
    console.error(`  ❌ Failed to post comment: ${err.status} — ${err.message}`);
  }
}

// fetch commit diff
async function fetchCommitDiff(octokit: Octokit, owner: string, repo: string, sha: string): Promise<string> {
  const res = await octokit.repos.getCommit({
    owner,
    repo,
    ref: sha,
    mediaType: { format: "diff" },
  });
  return (res.data as any as string).slice(0, 8000);
}

// main — called from webhook on push event
export async function triggerCommitReview({
  commits,
  repository,
  installation,
  ref,
}: {
  commits: any[];
  repository: any;
  installation: any;
  ref: string;
}) {
  try {
    if (!commits?.length) {
      console.log("⏭️  No commits to review");
      return;
    }

    if (!installation?.id) {
      console.log("⏭️  No installation ID — app may not be installed on this repo");
      return;
    }
    // only review pushes to main/master
    const branch = ref.replace("refs/heads/", "");
    if (!["main", "master"].includes(branch)) {
      console.log(`⏭️  Skipping commit review — branch is ${branch}, not main/master`);
      return;
    }

    const [owner, repo] = repository.full_name.split("/");
    const octokit = await getInstallationOctokit(installation.id);

    // review each commit (max 3 to avoid rate limits)
    for (const commit of commits.slice(0, 3)) {
      console.log(`\n🔍 Reviewing commit ${commit.id.slice(0, 7)} — "${commit.message}"`);

      const diff = await fetchCommitDiff(octokit, owner, repo, commit.id);
      console.log(`📄 Diff fetched (${diff.length} chars)`);

      const parsedFiles = parseDiffForLines(diff);
      if (parsedFiles.length === 0) {
        console.log(`⏭️  No changed lines found`);
        continue;
      }

      const comments = await getInlineComments(parsedFiles, repository.full_name, commit.message);
      console.log(`✅ ${comments.length} inline comments generated`);

      if (comments.length > 0) {
        await postInlineComments(octokit, owner, repo, commit.id, comments);
        console.log(`💬 Inline comments posted on commit ${commit.id.slice(0, 7)}`);
      } else {
        console.log(`✅ No issues found in this commit`);
      }
    }
  } catch (error: any) {
    console.error("Commit review error:", error?.message);
  }
}
