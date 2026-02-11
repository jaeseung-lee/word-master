"use server";

import {
  createSentence,
  updateSentence,
  deleteSentence,
} from "@/db/service/sentence";
import { analyzeText, extractTextFromImage } from "@/lib/openai";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSentenceAction(text: string) {
  const session = await requireAuth();
  const { definition, language } = await analyzeText(text);

  await createSentence({
    data: {
      text,
      definition,
      language: language as any,
      author: { connect: { id: session.userId } },
    },
  });

  revalidatePath("/");
}

export async function updateSentenceAction(id: number, text: string) {
  await requireAuth();
  const { definition, language } = await analyzeText(text);

  await updateSentence({
    where: { id },
    data: {
      text,
      definition,
      language: language as any,
    },
  });

  revalidatePath("/");
  revalidatePath(`/sentence/${id}`);
}

export async function deleteSentenceAction(id: number) {
  await requireAuth();
  await deleteSentence({ where: { id } });

  revalidatePath("/");
}

export async function extractTextFromImageAction(
  base64Image: string,
  mimeType: string,
): Promise<string> {
  await requireAuth();
  return extractTextFromImage(base64Image, mimeType);
}
