"use client";

import { useState } from "react";
import { Word } from "@/generated/proto/word";
import WordItem from "@/components/word/WordItem";
import WordForm from "@/components/word/WordForm";
import { Link } from "@/i18n/routing";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ModalLayout } from "@/components/ui/modal/ModalLayout";
import ModalProvider from "@/components/ui/modal/ModalProvider";
import { createWordWithSentenceAction } from "@/app/actions/word";

export default function WordListPage({ wordList }: { wordList: Word[] }) {
  const t = useTranslations();
  const [isWordFormOpen, setIsWordFormOpen] = useState(false);

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center justify-between border-b border-gray-04 bg-black px-4 py-3">
        <h1 className="text-lg font-semibold text-white">
          {t("word.listTitle")}
        </h1>
        <button
          onClick={() => setIsWordFormOpen(true)}
          className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-black transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("common.new")}
        </button>
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

      <ModalProvider>
        {isWordFormOpen && (
          <ModalLayout
            modalType="bottom-to-top"
            closeModal={() => setIsWordFormOpen(false)}
          >
            <div className="p-2">
              <h2 className="px-4 pt-2 text-base font-semibold text-white">
                {t("word.newTitle")}
              </h2>
              <p className="px-4 pt-1 text-xs text-gray-03">
                {t("word.newWithSentenceHint")}
              </p>
              <WordForm
                onSubmit={async (text) => {
                  await createWordWithSentenceAction(text);
                  setIsWordFormOpen(false);
                }}
              />
            </div>
          </ModalLayout>
        )}
      </ModalProvider>
    </div>
  );
}
