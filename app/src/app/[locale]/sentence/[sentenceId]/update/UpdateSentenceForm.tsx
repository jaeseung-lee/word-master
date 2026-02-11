"use client";

import { SentenceComposite } from "@/generated/proto/sentence";
import SentenceForm from "@/components/sentence/SentenceForm";
import { updateSentenceAction } from "@/app/actions/sentence";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UpdateSentenceForm({
  sentenceComposite,
}: {
  sentenceComposite: SentenceComposite;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { sentence } = sentenceComposite;

  if (!sentence) return null;

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center gap-3 border-b border-gray-04 bg-black px-4 py-3">
        <Link href={`/sentence/${sentence.id}`}>
          <ArrowLeft className="h-5 w-5 text-gray-02 hover:text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">
          {t("sentence.editTitle")}
        </h1>
      </div>
      <SentenceForm
        initialText={sentence.text}
        onSubmit={async (text) => {
          await updateSentenceAction(sentence.id, text);
          router.push(`/sentence/${sentence.id}`);
        }}
      />
    </div>
  );
}
