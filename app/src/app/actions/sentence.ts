"use server";

import {
  createSentence,
  updateSentence,
  deleteSentence,
} from "@/db/service/sentence";
import { analyzeText, extractTextFromImage } from "@/lib/openai";
import { requireAuth, getUserApiKey } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import convert from "heic-convert";

export async function createSentenceAction(text: string) {
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);
  const { definition, language } = await analyzeText(apiKey, text);

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
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);
  const { definition, language } = await analyzeText(apiKey, text);

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

const HEIC_TYPES = ["image/heic", "image/heif"];

export async function extractTextFromImageAction(
  formData: FormData,
): Promise<string> {
  const session = await requireAuth();
  const apiKey = await getUserApiKey(session.userId);

  const file = formData.get("image") as File;
  const arrayBuffer = await file.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);
  let mimeType = file.type;

  const isHeic =
    HEIC_TYPES.includes(file.type) ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  let finalBuffer: Buffer = rawBuffer;
  if (isHeic) {
    const result = await convert({
      buffer: rawBuffer,
      format: "PNG",
    });
    finalBuffer = Buffer.from(result);
    mimeType = "image/png";
  }

  const base64Image = finalBuffer.toString("base64");
  return extractTextFromImage(apiKey, base64Image, mimeType);
}
