"use client";

import { Word } from "@/generated/proto/word";
import { Language } from "@/generated/proto/language";
import { Separator } from "radix-ui";
import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";

const languageKeyMap: Record<number, string> = {
  [Language.LANGUAGE_ENGLISH]: "LANGUAGE_ENGLISH",
  [Language.LANGUAGE_KOREAN]: "LANGUAGE_KOREAN",
  [Language.LANGUAGE_JAPANESE]: "LANGUAGE_JAPANESE",
};

export default function WordItem({
  display,
  word,
}: {
  display: "card";
  word: Word;
}) {
  const t = useTranslations();
  const langKey = languageKeyMap[word.language] ?? "";
  const langLabel = langKey ? t(`language.short.${langKey}`) : "";

  switch (display) {
    case "card": {
      return (
        <div className="flex flex-col gap-2 rounded-md border border-gray-04 bg-light-black p-3">
          <div className="flex items-center justify-between">
            <span className="rounded bg-gray-04 px-1.5 py-0.5 text-xs font-medium text-gray-01">
              {langLabel}
            </span>
            {word.isBookmarked && (
              <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
            )}
          </div>

          <p className="text-sm font-medium text-white">{word.text}</p>

          {word.definition && (
            <>
              <Separator.Root className="h-px bg-gray-04" />
              <p className="text-xs text-gray-02">{word.definition}</p>
            </>
          )}
        </div>
      );
    }
  }
}
