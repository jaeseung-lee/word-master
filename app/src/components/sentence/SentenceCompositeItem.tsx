"use client";

import { Sentence } from "@/generated/proto/sentence";
import { Word } from "@/generated/proto/word";
import { Language } from "@/generated/proto/language";
import { Separator, Tooltip } from "radix-ui";
import { Bookmark, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

const languageKeyMap: Record<number, string> = {
  [Language.LANGUAGE_ENGLISH]: "LANGUAGE_ENGLISH",
  [Language.LANGUAGE_KOREAN]: "LANGUAGE_KOREAN",
  [Language.LANGUAGE_JAPANESE]: "LANGUAGE_JAPANESE",
};

export default function SentenceCompositeItem({
  display,
  sentence,
  wordList,
}: {
  display: "card" | "list";
  sentence: Sentence;
  wordList: Word[];
}) {
  const t = useTranslations();
  const langKey = languageKeyMap[sentence.language] ?? "";
  const langLabel = langKey ? t(`language.short.${langKey}`) : "";

  switch (display) {
    case "card": {
      return (
        <div className="flex flex-col gap-2 rounded-md border border-gray-04 bg-light-black p-3">
          <div className="flex items-center justify-between">
            <span className="rounded bg-gray-04 px-1.5 py-0.5 text-xs font-medium text-gray-01">
              {langLabel}
            </span>
            {sentence.isBookmarked && (
              <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
            )}
          </div>

          <p className="text-sm font-medium text-white">{sentence.text}</p>

          {sentence.definition && (
            <p className="text-xs text-gray-02">{sentence.definition}</p>
          )}

          {wordList.length > 0 && (
            <>
              <Separator.Root className="h-px bg-gray-04" />
              <Tooltip.Provider delayDuration={300}>
                <div className="flex flex-wrap gap-1.5">
                  {wordList.map((word) => (
                    <Tooltip.Root key={word.id}>
                      <Tooltip.Trigger asChild>
                        <span className="inline-flex cursor-default items-center gap-1 rounded bg-gray-04 px-2 py-0.5 text-xs text-gray-01 transition-colors hover:bg-gray-03 hover:text-white">
                          <BookOpen className="h-3 w-3" />
                          {word.text}
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          sideOffset={4}
                          className="z-1100 rounded-md border border-gray-04 bg-light-black px-3 py-2 text-xs text-gray-01 shadow-lg"
                        >
                          {word.definition || t("common.noDefinition")}
                          <Tooltip.Arrow className="fill-gray-04" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ))}
                </div>
              </Tooltip.Provider>
            </>
          )}
        </div>
      );
    }

    case "list": {
      return (
        <div className="flex items-center gap-3 border-b border-gray-04 px-3 py-2.5">
          <span className="shrink-0 rounded bg-gray-04 px-1.5 py-0.5 text-xs font-medium text-gray-01">
            {langLabel}
          </span>

          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm text-white">{sentence.text}</p>
            {sentence.definition && (
              <p className="truncate text-xs text-gray-03">
                {sentence.definition}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {wordList.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-03">
                <BookOpen className="h-3 w-3" />
                {wordList.length}
              </span>
            )}
            {sentence.isBookmarked && (
              <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
            )}
          </div>
        </div>
      );
    }
  }
}
