"use client";

import { useState } from "react";
import { SentenceComposite } from "@/generated/proto/sentence";
import { Language } from "@/generated/proto/language";
import SentenceForm from "@/components/sentence/SentenceForm";
import WordForm from "@/components/word/WordForm";
import WordItem from "@/components/word/WordItem";
import { ModalLayout } from "@/components/ui/modal/ModalLayout";
import ModalProvider from "@/components/ui/modal/ModalProvider";
import {
  updateSentenceAction,
  deleteSentenceAction,
} from "@/app/actions/sentence";
import { createWordAction } from "@/app/actions/word";
import { Link, useRouter } from "@/i18n/routing";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { Separator } from "radix-ui";
import { toggleSentenceBookmarkAction } from "./actions";
import { useTranslations } from "next-intl";

const languageKeyMap: Record<number, string> = {
  [Language.LANGUAGE_ENGLISH]: "LANGUAGE_ENGLISH",
  [Language.LANGUAGE_KOREAN]: "LANGUAGE_KOREAN",
  [Language.LANGUAGE_JAPANESE]: "LANGUAGE_JAPANESE",
};

export default function SentenceDetailPage({
  sentenceComposite,
}: {
  sentenceComposite: SentenceComposite;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { sentence, wordList } = sentenceComposite;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isWordFormOpen, setIsWordFormOpen] = useState(false);

  if (!sentence) return null;

  const langKey = languageKeyMap[sentence.language] ?? "";
  const langLabel = langKey ? t(`language.long.${langKey}`) : "";

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center gap-3 border-b border-gray-04 bg-black px-4 py-3">
        <Link href="/">
          <ArrowLeft className="h-5 w-5 text-gray-02 hover:text-white" />
        </Link>
        <h1 className="flex-1 truncate text-lg font-semibold text-white">
          {t("sentence.pageTitle")}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              await toggleSentenceBookmarkAction(sentence.id);
            }}
            className="rounded-md p-1.5 text-gray-02 transition-colors hover:text-primary"
          >
            <Bookmark
              className={`h-4 w-4 ${sentence.isBookmarked ? "fill-primary text-primary" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-md p-1.5 text-gray-02 transition-colors hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={async () => {
              await deleteSentenceAction(sentence.id);
              router.push("/");
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
          <p className="text-base text-white">{sentence.text}</p>
          {sentence.definition && (
            <p className="text-sm text-gray-02">{sentence.definition}</p>
          )}
        </div>

        <Separator.Root className="h-px bg-gray-04" />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-02" />
              <h2 className="text-sm font-semibold text-gray-01">
                {t("sentence.words", { count: wordList.length })}
              </h2>
            </div>
            <button
              onClick={() => setIsWordFormOpen(true)}
              className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-black transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("word.addWord")}
            </button>
          </div>

          {wordList.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-03">
              {t("word.empty")}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {wordList.map((word) => (
                <Link
                  key={word.id}
                  href={`/sentence/${sentence.id}/word/${word.id}`}
                >
                  <WordItem display="card" word={word} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalProvider>
        {isEditOpen && (
          <ModalLayout
            modalType="bottom-to-top"
            closeModal={() => setIsEditOpen(false)}
          >
            <div className="p-2">
              <h2 className="px-4 pt-2 text-base font-semibold text-white">
                {t("sentence.editTitle")}
              </h2>
              <SentenceForm
                initialText={sentence.text}
                onSubmit={async (text) => {
                  await updateSentenceAction(sentence.id, text);
                  setIsEditOpen(false);
                }}
              />
            </div>
          </ModalLayout>
        )}
      </ModalProvider>

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
              <WordForm
                onSubmit={async (text) => {
                  await createWordAction(text, sentence.id);
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
