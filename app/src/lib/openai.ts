import OpenAI from "openai";
import type { ChatCompletionContentPart } from "openai/resources/chat/completions";

/**
 * 유저의 API 키로 OpenAI 클라이언트를 생성합니다.
 */
function createClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

/**
 * 문장의 뜻(definition)과 언어를 OpenAI로 분석합니다.
 * - definition: 한국어로 된 해석/뜻
 * - language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE"
 */
export async function analyzeText(
  apiKey: string,
  text: string,
): Promise<{
  definition: string;
  language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE";
}> {
  const openai = createClient(apiKey);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a language analysis assistant. Given a sentence or word, you must:
1. Detect its language (English, Korean, or Japanese).
2. Provide a Korean translation/definition of the text.

Rules:
- If the text is Korean, the definition should be a brief explanation of the meaning in Korean.
- If the text is English or Japanese, the definition should be the Korean translation.
- Keep the definition concise (1-2 sentences).`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: 300,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "text_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            definition: { type: "string" },
            language: {
              type: "string",
              enum: [
                "LANGUAGE_ENGLISH",
                "LANGUAGE_KOREAN",
                "LANGUAGE_JAPANESE",
              ],
            },
          },
          required: ["definition", "language"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.choices[0].message.content!) as {
    definition: string;
    language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE";
  };

  return {
    definition: parsed.definition,
    language: parsed.language,
  };
}

/**
 * 이미지에서 문장(텍스트)을 추출합니다.
 * base64 인코딩된 이미지를 받아 OpenAI Vision으로 OCR을 수행합니다.
 */
export async function extractTextFromImage(
  apiKey: string,
  base64Image: string,
  mimeType: string,
): Promise<string> {
  const openai = createClient(apiKey);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an OCR assistant. Extract ALL text/sentences visible in the image.
Return the extracted text, one sentence per line.
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
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ocr_result",
        strict: true,
        schema: {
          type: "object",
          properties: {
            text: { type: "string" },
          },
          required: ["text"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.choices[0].message.content!) as {
    text: string;
  };

  return parsed.text;
}
