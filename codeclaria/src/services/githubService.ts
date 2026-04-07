const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".turbo", ".cache", "vendor", "__pycache__", ".venv", "venv",
  "public", "static", "assets", "images", "fonts", "icons",
]);

const PRIORITY_DIRS = [
  "src", "app", "pages", "lib", "utils", "hooks",
  "components", "api", "server", "routes", "controllers", "models", "services",
];

const CODE_EXTENSIONS = /\.(ts|tsx|js|jsx|py|go|rs|java|rb|php|cs|vue|svelte|prisma|graphql|json|md|css|scss|yaml|yml|env\.example)$/;

export interface RepoFile {
  path: string;
  content: string;
}

function parseRepoUrl(url: string): { owner: string; repo: string } {
  const clean = url.replace("https://github.com/", "").replace(/\/+$/, "");
  const [owner, repo] = clean.split("/");
  return { owner, repo };
}

async function fetchContents(owner: string, repo: string, path = ""): Promise<any[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "GitHub API error");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function collectFileRefs(
  owner: string,
  repo: string,
  path = "",
  depth = 0,
  refs: any[] = []
): Promise<any[]> {
  if (depth > 4 || refs.length > 300) return refs;

  const items = await fetchContents(owner, repo, path);
  const dirs = items.filter((i) => i.type === "dir" && !SKIP_DIRS.has(i.name));
  const files = items.filter((i) => i.type === "file" && CODE_EXTENSIONS.test(i.name));

  refs.push(...files);

  // priority dirs first
  const sorted = dirs.sort((a, b) => {
    return (PRIORITY_DIRS.includes(b.name) ? 1 : 0) - (PRIORITY_DIRS.includes(a.name) ? 1 : 0);
  });

  for (const dir of sorted) {
    await collectFileRefs(owner, repo, dir.path, depth + 1, refs);
  }

  return refs;
}

export async function fetchRepoFiles(repoUrl: string): Promise<RepoFile[]> {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const refs = await collectFileRefs(owner, repo);

  // fetch content in parallel, truncate at 3000 chars
  const results = await Promise.allSettled(
    refs.slice(0, 60).map(async (ref) => {
      const res = await fetch(ref.download_url, { headers });
      const text = await res.text();
      return { path: ref.path, content: text.slice(0, 1500) } as RepoFile;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<RepoFile> => r.status === "fulfilled")
    .map((r) => r.value);
}
