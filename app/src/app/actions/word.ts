"use server";

import { createWord, updateWord, deleteWord } from "@/db/service/word";
import { analyzeText } from "@/lib/openai";
import { requireAuth, getUserApiKey } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWordAction(text: string, sentenceId: number) {
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);
  const { definition, language } = await analyzeText(apiKey, text);

  await createWord({
    data: {
      text,
      definition,
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
  const { definition, language } = await analyzeText(apiKey, text);

  const word = await updateWord({
    where: { id },
    data: {
      text,
      definition,
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
