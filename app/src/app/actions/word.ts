"use server";

import { createWord, updateWord, deleteWord } from "@/db/service/word";
import { createSentence } from "@/db/service/sentence";
import { analyzeText, analyzeWordWithExample } from "@/lib/openai";
import { requireAuth, getUserApiKey } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWordAction(text: string, sentenceId: number) {
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);
  const { definition, explanation, language } = await analyzeText(apiKey, text);

  await createWord({
    data: {
      text,
      definition,
      explanation,
      language: language as any,
      sentence_id: sentenceId,
      author_id: session.userId,
    },
  });

  revalidatePath("/");
  revalidatePath(`/sentence/${sentenceId}`);
  revalidatePath("/words");
}

export async function updateWordAction(id: number, text: string) {
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);
  const { definition, explanation, language } = await analyzeText(apiKey, text);

  const word = await updateWord({
    where: { id },
    data: {
      text,
      definition,
      explanation,
      language: language as any,
    },
  });

  revalidatePath("/");
  revalidatePath(`/sentence/${word.sentenceId}`);
  revalidatePath("/words");
}

export async function deleteWordAction(id: number, sentenceId: number) {
  await requireAuth();
  await deleteWord({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/sentence/${sentenceId}`);
  revalidatePath("/words");
}

/**
 * 단어를 입력하면 AI가 예문 문장을 생성하고,
 * 문장과 단어를 모두 뜻과 함께 저장합니다.
 */
export async function createWordWithSentenceAction(wordText: string) {
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);

  const {
    wordDefinition,
    wordExplanation,
    language,
    exampleSentence,
    sentenceDefinition,
    sentenceExplanation,
  } = await analyzeWordWithExample(apiKey, wordText);

  // 1. 예문 문장 생성
  const sentence = await createSentence({
    data: {
      text: exampleSentence,
      definition: sentenceDefinition,
      explanation: sentenceExplanation,
      language: language as any,
      author: { connect: { id: session.userId } },
    },
  });

  // 2. 단어를 해당 문장에 연결하여 생성
  await createWord({
    data: {
      text: wordText,
      definition: wordDefinition,
      explanation: wordExplanation,
      language: language as any,
      sentence_id: sentence.id,
      author_id: session.userId,
    },
  });

  revalidatePath("/");
  revalidatePath("/words");
}
