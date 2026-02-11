import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 문장의 뜻(definition)과 언어를 OpenAI로 분석합니다.
 * - definition: 한국어로 된 해석/뜻
 * - language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE"
 */
export async function analyzeText(text: string): Promise<{
  definition: string;
  language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE";
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a language analysis assistant. Given a sentence or word, you must:
1. Detect its language (English, Korean, or Japanese).
2. Provide a Korean translation/definition of the text.

Respond in JSON only, with this exact format:
{"definition": "<한국어 뜻/해석>", "language": "<LANGUAGE_ENGLISH|LANGUAGE_KOREAN|LANGUAGE_JAPANESE>"}

Rules:
- If the text is Korean, the definition should be a brief explanation of the meaning in Korean.
- If the text is English or Japanese, the definition should be the Korean translation.
- Keep the definition concise (1-2 sentences).
- Do NOT include any markdown or extra text, only valid JSON.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content?.trim() ?? "";

  try {
    const parsed = JSON.parse(content);
    return {
      definition: parsed.definition ?? "",
      language: parsed.language ?? "LANGUAGE_JAPANESE",
    };
  } catch {
    return {
      definition: "",
      language: "LANGUAGE_JAPANESE",
    };
  }
}
