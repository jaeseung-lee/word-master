import OpenAI from "openai";
import type { ChatCompletionContentPart } from "openai/resources/chat/completions";

/**
 * 유저의 API 키로 OpenAI 클라이언트를 생성합니다.
 */
function createClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

/**
 * 문장의 뜻(definition), 설명(explanation), 언어를 OpenAI로 분석합니다.
 */
export async function analyzeText(
  apiKey: string,
  text: string,
): Promise<{
  definition: string;
  explanation: string;
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
3. Provide a detailed Korean explanation that covers:
   - Why the meaning is derived this way (grammar/structure breakdown)
   - What nuance or feeling the text conveys
   - 1-2 additional example sentences in the original language with Korean translations

Rules:
- If the text is Korean, the definition should be a brief explanation of the meaning in Korean.
- If the text is English or Japanese, the definition should be the Korean translation.
- Keep the definition concise (1-2 sentences).
- The explanation should be detailed and educational, written in Korean.
- If the text is Japanese, the explanation MUST include hiragana readings (ふりがな) for all kanji. For example: "食べる(たべる)", "勉強(べんきょう)する". Also include the full hiragana reading of the sentence at the beginning of the explanation.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: 800,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "text_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            definition: { type: "string" },
            explanation: { type: "string" },
            language: {
              type: "string",
              enum: [
                "LANGUAGE_ENGLISH",
                "LANGUAGE_KOREAN",
                "LANGUAGE_JAPANESE",
              ],
            },
          },
          required: ["definition", "explanation", "language"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.choices[0].message.content!) as {
    definition: string;
    explanation: string;
    language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE";
  };

  return parsed;
}

/**
 * 단어를 분석하고, 그 단어를 사용한 예문을 함께 생성합니다.
 */
export async function analyzeWordWithExample(
  apiKey: string,
  word: string,
): Promise<{
  wordDefinition: string;
  wordExplanation: string;
  language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE";
  exampleSentence: string;
  sentenceDefinition: string;
  sentenceExplanation: string;
}> {
  const openai = createClient(apiKey);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a language learning assistant. Given a word, you must:
1. Detect its language (English, Korean, or Japanese).
2. Provide a Korean definition of the word.
3. Provide a detailed Korean explanation of the word covering: why the meaning is this way, what nuance/feeling it conveys, and 1-2 additional example usages.
4. Create an example sentence using the word in its original language.
5. Provide a Korean translation of the example sentence.
6. Provide a detailed Korean explanation of the example sentence covering: grammar/structure breakdown, nuance, and how the word is used in context.

Rules:
- If the word is Korean, provide a brief Korean explanation and an example sentence in Korean.
- If the word is English or Japanese, provide the Korean translation and an example sentence in the original language.
- Keep the word definition concise (1 line).
- The example sentence should be natural and practical for language learners.
- Keep the sentence definition concise (1-2 sentences).
- Both explanations should be detailed and educational, written in Korean.
- If the word is Japanese, the word explanation MUST include hiragana readings (ふりがな) for all kanji. For example: "食べる(たべる)", "勉強(べんきょう)する". Include the full hiragana reading of the word at the beginning.
- If the word is Japanese, the sentence explanation MUST also include the full hiragana reading of the example sentence at the beginning, with hiragana readings for all kanji.`,
      },
      {
        role: "user",
        content: word,
      },
    ],
    temperature: 0.5,
    max_tokens: 1000,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "word_with_example",
        strict: true,
        schema: {
          type: "object",
          properties: {
            wordDefinition: { type: "string" },
            wordExplanation: { type: "string" },
            language: {
              type: "string",
              enum: [
                "LANGUAGE_ENGLISH",
                "LANGUAGE_KOREAN",
                "LANGUAGE_JAPANESE",
              ],
            },
            exampleSentence: { type: "string" },
            sentenceDefinition: { type: "string" },
            sentenceExplanation: { type: "string" },
          },
          required: [
            "wordDefinition",
            "wordExplanation",
            "language",
            "exampleSentence",
            "sentenceDefinition",
            "sentenceExplanation",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.choices[0].message.content!) as {
    wordDefinition: string;
    wordExplanation: string;
    language: "LANGUAGE_ENGLISH" | "LANGUAGE_KOREAN" | "LANGUAGE_JAPANESE";
    exampleSentence: string;
    sentenceDefinition: string;
    sentenceExplanation: string;
  };

  return parsed;
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
