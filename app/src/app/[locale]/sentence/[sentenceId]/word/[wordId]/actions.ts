"use server";

import { toggleWordBookmark } from "@/db/service/word";
import { revalidatePath } from "next/cache";

export async function toggleWordBookmarkAction(id: number) {
  const word = await toggleWordBookmark({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/sentence/${word.sentenceId}`);
  revalidatePath(`/sentence/${word.sentenceId}/word/${id}`);
  revalidatePath("/words");
}
