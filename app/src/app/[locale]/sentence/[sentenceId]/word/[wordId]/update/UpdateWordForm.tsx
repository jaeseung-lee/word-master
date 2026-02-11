"use client";

import { Word } from "@/generated/proto/word";
import WordForm from "@/components/word/WordForm";
import { updateWordAction } from "@/app/actions/word";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UpdateWordForm({
  word,
  sentenceId,
}: {
  word: Word;
  sentenceId: number;
}) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center gap-3 border-b border-gray-04 bg-black px-4 py-3">
        <Link href={`/sentence/${sentenceId}/word/${word.id}`}>
          <ArrowLeft className="h-5 w-5 text-gray-02 hover:text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">
          {t("word.editTitle")}
        </h1>
      </div>
      <WordForm
        initialText={word.text}
        onSubmit={async (text) => {
          await updateWordAction(word.id, text);
          router.push(`/sentence/${sentenceId}/word/${word.id}`);
        }}
      />
    </div>
  );
}
