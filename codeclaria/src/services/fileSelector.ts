import { RepoFile } from "./githubService";

// High-priority file patterns — always include if present
const ALWAYS_INCLUDE = [
  /package\.json$/, /readme\.md$/i, /schema\.prisma$/,
  /tsconfig\.json$/, /next\.config\.(ts|js)$/, /vite\.config\.(ts|js)$/,
];

// Domain keyword map — question keywords → relevant file path patterns
const KEYWORD_MAP: Record<string, RegExp[]> = {
  auth:         [/auth/, /login/, /session/, /jwt/, /token/, /middleware/, /guard/],
  login:        [/auth/, /login/, /session/, /signin/],
  database:     [/db/, /database/, /prisma/, /mongoose/, /model/, /schema/, /migration/],
  db:           [/db/, /database/, /prisma/, /mongoose/, /model/, /schema/],
  api:          [/api/, /route/, /endpoint/, /controller/, /handler/],
  route:        [/route/, /router/, /navigation/, /page/, /app/],
  component:    [/component/, /ui/, /widget/, /layout/],
  config:       [/config/, /env/, /setting/, /constant/],
  test:         [/test/, /spec/, /mock/, /fixture/],
  style:        [/style/, /css/, /scss/, /theme/, /tailwind/],
  user:         [/user/, /profile/, /account/, /member/],
  payment:      [/payment/, /stripe/, /billing/, /subscription/],
  email:        [/email/, /mail/, /smtp/, /notification/],
  upload:       [/upload/, /file/, /storage/, /s3/, /blob/],
  cache:        [/cache/, /redis/, /memory/],
  deploy:       [/deploy/, /docker/, /ci/, /workflow/, /action/],
};

function scoreFile(file: RepoFile, question: string): number {
  let score = 0;
  const q = question.toLowerCase();
  const p = file.path.toLowerCase();

  // always include critical files
  if (ALWAYS_INCLUDE.some((r) => r.test(p))) score += 5;

  // keyword matching from question
  for (const [keyword, patterns] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(keyword)) {
      if (patterns.some((r) => r.test(p))) score += 10;
    }
  }

  // direct word match between question words and file path
  const words = q.replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 3);
  for (const word of words) {
    if (p.includes(word)) score += 8;
  }

  // content match — does the file content mention question keywords?
  const content = file.content.toLowerCase();
  for (const word of words) {
    if (content.includes(word)) score += 2;
  }

  // priority dirs boost
  const priorityDirs = ["src", "app", "lib", "api", "server", "routes", "models", "services"];
  if (priorityDirs.some((d) => p.startsWith(d + "/"))) score += 3;

  // penalize test/mock files unless question is about tests
  if ((p.includes("test") || p.includes("spec") || p.includes("mock")) && !q.includes("test")) {
    score -= 5;
  }

  return score;
}

export function selectRelevantFiles(files: RepoFile[], question: string, limit = 8): RepoFile[] {
  const scored = files.map((f) => ({ file: f, score: scoreFile(f, question) }));
  scored.sort((a, b) => b.score - a.score);
  // always return top files regardless of score — never filter to 0
  return scored.slice(0, limit).map((s) => s.file);
}
