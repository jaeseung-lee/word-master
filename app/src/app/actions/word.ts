"use server";

import { createWord, updateWord, deleteWord } from "@/db/service/word";
import { analyzeText } from "@/lib/openai";
import { revalidatePath } from "next/cache";

export async function createWordAction(text: string, sentenceId: number) {
  const { definition, language } = await analyzeText(text);

  await createWord({
    data: {
      text,
      definition,
      language: language as any,
      sentence_id: sentenceId,
    },
  });

  revalidatePath("/");
  revalidatePath(`/sentence/${sentenceId}`);
  revalidatePath("/words");
}

export async function updateWordAction(id: number, text: string) {
  const { definition, language } = await analyzeText(text);

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
  await deleteWord({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/sentence/${sentenceId}`);
  revalidatePath("/words");
}
