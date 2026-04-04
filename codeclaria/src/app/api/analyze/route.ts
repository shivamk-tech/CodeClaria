import { NextRequest, NextResponse } from "next/server"

function parseRepo(url: string) {
  const clean = url.replace("https://github.com/", "")
  const [owner, repo] = clean.split("/")
  return { owner, repo }
}

// recursive fetch
async function getRepoFiles(owner: string, repo: string, path = "") {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  );

  const data = await res.json();

  let files: any[] = [];

  for (const item of data) {
    if (item.type === "file") {
      // filter only useful files
      if (!item.name.match(/\.(js|ts|jsx|tsx|py|java|cpp|c|go)$/)) continue;

      const fileRes = await fetch(item.download_url);
      const content = await fileRes.text();

      files.push({
        name: item.name,
        path: item.path,
        content,
      });
    }

    if (item.type === "dir") {
      // skip heavy folders
      if (["node_modules", ".git", "dist", "build"].includes(item.name)) continue;

      const nested = await getRepoFiles(owner, repo, item.path);
      files = files.concat(nested);
    }
  }

  return files;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    const { owner, repo } = parseRepo(url);

    const files = await getRepoFiles(owner, repo);

    return NextResponse.json({
      success: true,
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Something went wrong",
    });
  }
}