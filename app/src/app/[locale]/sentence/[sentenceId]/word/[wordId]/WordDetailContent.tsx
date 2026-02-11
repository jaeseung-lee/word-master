"use client";

import { Word } from "@/generated/proto/word";
import { Language } from "@/generated/proto/language";
import { deleteWordAction } from "@/app/actions/word";
import { toggleWordBookmarkAction } from "./actions";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowLeft, Pencil, Trash2, Bookmark } from "lucide-react";
import { Separator } from "radix-ui";
import { useTranslations } from "next-intl";

const languageKeyMap: Record<number, string> = {
  [Language.LANGUAGE_ENGLISH]: "LANGUAGE_ENGLISH",
  [Language.LANGUAGE_KOREAN]: "LANGUAGE_KOREAN",
  [Language.LANGUAGE_JAPANESE]: "LANGUAGE_JAPANESE",
};

export default function WordDetailContent({
  word,
  sentenceId,
}: {
  word: Word;
  sentenceId: number;
}) {
  const t = useTranslations();
  const router = useRouter();
  const langKey = languageKeyMap[word.language] ?? "";
  const langLabel = langKey ? t(`language.long.${langKey}`) : "";

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center gap-3 border-b border-gray-04 bg-black px-4 py-3">
        <Link href={`/sentence/${sentenceId}`}>
          <ArrowLeft className="h-5 w-5 text-gray-02 hover:text-white" />
        </Link>
        <h1 className="flex-1 truncate text-lg font-semibold text-white">
          {t("word.pageTitle")}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              await toggleWordBookmarkAction(word.id);
            }}
            className="rounded-md p-1.5 text-gray-02 transition-colors hover:text-primary"
          >
            <Bookmark
              className={`h-4 w-4 ${word.isBookmarked ? "fill-primary text-primary" : ""}`}
            />
          </button>
          <Link href={`/sentence/${sentenceId}/word/${word.id}/update`}>
            <Pencil className="h-4 w-4 text-gray-02 hover:text-white" />
          </Link>
          <button
            onClick={async () => {
              await deleteWordAction(word.id, sentenceId);
              router.push(`/sentence/${sentenceId}`);
            }}
            className="rounded-md p-1.5 text-gray-02 transition-colors hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded bg-gray-04 px-2 py-0.5 text-xs font-medium text-gray-01">
            {langLabel}
          </span>
          <p className="text-lg font-medium text-white">{word.text}</p>
        </div>

        {word.definition && (
          <>
            <Separator.Root className="h-px bg-gray-04" />
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-gray-03">
                {t("common.definition")}
              </p>
              <p className="text-sm text-gray-01">{word.definition}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
