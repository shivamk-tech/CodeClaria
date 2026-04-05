import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeCode(code: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Analyze this codebase and provide:
1. A plain-English explanation of what this code does
2. The main architecture and how files connect
3. Key issues or improvements needed
4. Code quality assessment
5.respond ONLY in valid JSON with the following structure.
{
  "summary": "plain English explanation of the codebase",
  "architecture": {
    "overview": "high-level architecture",
    "flow": ["step 1", "step 2", "step 3"],
    "components": [
      {
        "name": "component/file name",
        "role": "what it does",
        "connections": ["what it connects to"]
      }
    ]
  },
  "issues": [
    {
      "title": "issue name",
      "description": "what is wrong",
      "severity": "low | medium | high",
      "fix": "how to fix it"
    }
  ],
  "code_quality": {
    "score": 8,
    "strengths": ["point 1", "point 2"],
    "weaknesses": ["point 1", "point 2"]
  }
}

Code:
${code.slice(0, 12000)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || "No response from AI";
  } catch (error: any) {
    console.error("Groq error:", error);
    throw error;
  }
}
