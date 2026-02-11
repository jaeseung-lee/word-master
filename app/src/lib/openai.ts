import OpenAI from "openai";
import type { ChatCompletionContentPart } from "openai/resources/chat/completions";

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

/**
 * 이미지에서 문장(텍스트)을 추출합니다.
 * base64 인코딩된 이미지를 받아 OpenAI Vision으로 OCR을 수행합니다.
 */
export async function extractTextFromImage(
  base64Image: string,
  mimeType: string,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an OCR assistant. Extract ALL text/sentences visible in the image.
Return ONLY the extracted text, one sentence per line.
Do NOT add any explanation, translation, or commentary.
Preserve the original language of the text exactly as it appears.`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ] as ChatCompletionContentPart[],
      },
    ],
    temperature: 0.1,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}
