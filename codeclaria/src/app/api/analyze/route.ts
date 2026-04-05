import { NextRequest, NextResponse } from "next/server"
import { analyzeCode } from "@/lib/gemini";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const githubHeaders: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
}

// dirs to always skip
const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".turbo", ".cache", "vendor", "__pycache__", ".venv", "venv",
  "public", "static", "assets", "images", "fonts", "icons",
])

// priority files — always grab these if they exist
const PRIORITY_FILES = [
  "package.json", "tsconfig.json", "next.config.ts", "next.config.js",
  "vite.config.ts", "vite.config.js", "tailwind.config.ts", "tailwind.config.js",
  "prisma/schema.prisma", "README.md",
]

// important dirs to prioritize
const PRIORITY_DIRS = ["src", "app", "pages", "lib", "utils", "hooks", "components", "api", "server", "routes", "controllers", "models", "services"]

function parseRepo(url: string) {
  const clean = url.replace("https://github.com/", "").replace(/\/+$/, "")
  const [owner, repo] = clean.split("/")
  return { owner, repo }
}

async function fetchContents(owner: string, repo: string, path = ""): Promise<any[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: githubHeaders }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "GitHub API error")
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function fetchFileContent(downloadUrl: string): Promise<string> {
  const res = await fetch(downloadUrl, { headers: githubHeaders })
  const text = await res.text()
  // truncate large files to 3000 chars
  return text.slice(0, 3000)
}

function isCodeFile(name: string): boolean {
  return /\.(js|ts|jsx|tsx|py|java|cpp|c|go|rb|rs|php|cs|swift|kt|vue|svelte|prisma|graphql|sql|env\.example|yaml|yml|json|md|css|scss|sass|less|html)$/.test(name)
}

function scoreFile(path: string): number {
  let score = 0
  // root level files are most important
  if (!path.includes("/")) score += 10
  // priority dirs
  for (const dir of PRIORITY_DIRS) {
    if (path.startsWith(dir + "/") || path.includes("/" + dir + "/")) score += 5
  }
  // entry points
  if (/index\.(ts|tsx|js|jsx)$/.test(path)) score += 8
  if (/main\.(ts|tsx|js|jsx|py|go)$/.test(path)) score += 8
  if (/app\.(ts|tsx|js|jsx)$/.test(path)) score += 7
  if (/layout\.(ts|tsx|js|jsx)$/.test(path)) score += 6
  if (/page\.(ts|tsx|js|jsx)$/.test(path)) score += 5
  if (/route\.(ts|tsx|js|jsx)$/.test(path)) score += 5
  // config files
  if (/\.(config|setup|init)\.(ts|js)$/.test(path)) score += 4
  // model/schema files
  if (/\.(model|schema|entity)\.(ts|js)$/.test(path)) score += 4
  if (/schema\.prisma$/.test(path)) score += 9
  // auth files
  if (/auth\.(ts|js)$/.test(path)) score += 6
  // README
  if (/readme\.md$/i.test(path)) score += 7
  // package.json
  if (/package\.json$/.test(path)) score += 9
  // css/styles
  if (/globals\.(css|scss|sass)$/.test(path)) score += 6
  if (/\.(css|scss|sass|less)$/.test(path) && !path.includes("node_modules")) score += 3
  // json configs
  if (/tsconfig\.json$/.test(path)) score += 7
  if (/\.json$/.test(path) && !path.includes("node_modules")) score += 2
  return score
}

async function collectFiles(owner: string, repo: string, path = "", depth = 0, allFiles: any[] = []): Promise<any[]> {
  if (depth > 4) return allFiles

  const items = await fetchContents(owner, repo, path)

  // sort: priority dirs first, then files
  const dirs = items.filter(i => i.type === "dir" && !SKIP_DIRS.has(i.name))
  const files = items.filter(i => i.type === "file" && isCodeFile(i.name))

  // add files with scores
  for (const file of files) {
    allFiles.push({ ...file, score: scoreFile(file.path) })
  }

  // recurse into dirs — priority dirs first
  const sortedDirs = dirs.sort((a, b) => {
    const aP = PRIORITY_DIRS.includes(a.name) ? 1 : 0
    const bP = PRIORITY_DIRS.includes(b.name) ? 1 : 0
    return bP - aP
  })

  for (const dir of sortedDirs) {
    if (allFiles.length > 200) break // stop collecting after 200 file refs
    await collectFiles(owner, repo, dir.path, depth + 1, allFiles)
  }

  return allFiles
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    const { owner, repo } = parseRepo(url)

    // collect all file references
    const allFiles = await collectFiles(owner, repo)

    // sort by score and take top 25
    const topFiles = allFiles
      .sort((a, b) => b.score - a.score)
      .slice(0, 25)

    // fetch content for top files in parallel
    const filesWithContent = await Promise.all(
      topFiles.map(async (file) => {
        try {
          const content = await fetchFileContent(file.download_url)
          return { path: file.path, content }
        } catch {
          return null
        }
      })
    )

    const validFiles = filesWithContent.filter(Boolean)

    // build combined code string capped at 14000 chars
    const combinedCode = validFiles
      .map((f) => `// File: ${f!.path}\n${f!.content}`)
      .join("\n\n---\n\n")
      .slice(0, 14000)

    // build dependency map from imports
    const deps: Record<string, string[]> = {}
    for (const f of validFiles) {
      if (!f) continue
      const imports: string[] = []
      const lines = f.content.split("\n")
      for (const line of lines) {
        const match = line.match(/(?:import|require).*?['"]([^'"]+)['"]/)
        if (match) {
          const imp = match[1]
          // only local imports
          if (imp.startsWith(".") || imp.startsWith("@/") || imp.startsWith("~/")) {
            imports.push(imp)
          }
        }
      }
      deps[f.path] = imports
    }

    let aiResult = ""
    try {
      aiResult = await analyzeCode(combinedCode)
    } catch (e) {
      console.error("AI error:", e)
      aiResult = "AI failed to respond"
    }

    return NextResponse.json({
      success: true,
      totalFiles: allFiles.length,
      analyzedFiles: validFiles.length,
      result: aiResult,
      dependencies: deps,
      files: validFiles.map(f => f?.path),
    })
  } catch (error: any) {
    console.error("Analyze error:", error)
    return NextResponse.json({
      success: false,
      error: error?.message || "Something went wrong",
    })
  }
}
