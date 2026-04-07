import Groq from "groq-sdk";
import { RepoFile } from "./githubService";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// extract file references mentioned in the AI response
function extractReferencedFiles(answer: string, files: RepoFile[]): string[] {
  const referenced: string[] = [];
  for (const file of files) {
    const name = file.path.split("/").pop() || "";
    if (answer.includes(file.path) || answer.includes(name)) {
      referenced.push(file.path);
    }
  }
  return [...new Set(referenced)];
}

export async function askAboutRepo(
  files: RepoFile[],
  question: string
): Promise<{ answer: string; referencedFiles: string[] }> {
  // build context — deduplicate and cap total tokens
  const seen = new Set<string>();
  let totalChars = 0;
  const MAX_CHARS = 8000;

  const context = files
    .filter((f) => {
      if (seen.has(f.path)) return false;
      seen.add(f.path);
      return true;
    })
    .map((f) => {
      const chunk = `// ${f.path}\n${f.content}`;
      totalChars += chunk.length;
      return totalChars <= MAX_CHARS ? chunk : null;
    })
    .filter(Boolean)
    .join("\n\n---\n\n");

  console.log("\n📦 Files sent to Groq:");
  console.log([...seen].map((p, i) => `  ${i + 1}. ${p}`).join("\n"));
  console.log(`📊 Total context chars: ${totalChars}\n`);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 512,
    messages: [
      {
        role: "system",
        content: `You are a senior developer who has fully read and understood this codebase.
Answer the question based on the provided files. Be helpful and specific.
- Mention exact file names and line references where relevant logic exists
- Use inline code formatting for file names, functions, and code snippets  
- If you can partially answer from the files, do so and mention what you found
- Only say "not found" if there is truly zero relevant code in any of the files
- Be concise but thorough`,
      },
      {
        role: "user",
        content: `FILES:\n${context}\n\nQUESTION: ${question}`,
      },
    ],
  });

  const answer = response.choices[0]?.message?.content || "No response from AI";
  const referencedFiles = extractReferencedFiles(answer, files);

  return { answer, referencedFiles };
}
