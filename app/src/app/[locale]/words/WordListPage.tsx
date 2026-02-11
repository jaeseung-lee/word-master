"use client";

import { Word } from "@/generated/proto/word";
import WordItem from "@/components/word/WordItem";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function WordListPage({ wordList }: { wordList: Word[] }) {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center justify-between border-b border-gray-04 bg-black px-4 py-3">
        <h1 className="text-lg font-semibold text-white">
          {t("word.listTitle")}
        </h1>
      </div>

      {wordList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-03">{t("word.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-4">
          {wordList.map((word) => (
            <Link
              key={word.id}
              href={`/sentence/${word.sentenceId}/word/${word.id}`}
            >
              <WordItem display="card" word={word} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
