import { NextRequest, NextResponse } from "next/server";
import { selectRelevantFiles } from "@/services/fileSelector";
import { askAboutRepo } from "@/services/aiService";
import { RepoFile } from "@/services/githubService";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, question, filesContent } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    // use files passed directly from the analyze page
    let files: RepoFile[] = [];

    if (filesContent && typeof filesContent === "object") {
      files = Object.entries(filesContent).map(([path, content]) => ({
        path,
        content: content as string,
      }));
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files available. Please analyze a repo first." }, { status: 400 });
    }

    // select relevant files for this question
    const relevantFiles = selectRelevantFiles(files, question);

    // ask AI
    const { answer, referencedFiles } = await askAboutRepo(relevantFiles, question);

    return NextResponse.json({ answer, referencedFiles });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error?.message || "Something went wrong" }, { status: 500 });
  }
}
