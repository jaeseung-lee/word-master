"use server";

import { toggleSentenceBookmark } from "@/db/service/sentence";
import { revalidatePath } from "next/cache";

export async function toggleSentenceBookmarkAction(id: number) {
  await toggleSentenceBookmark({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/sentence/${id}`);
}
