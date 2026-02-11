"use client";

import { useState } from "react";
import { SentenceComposite } from "@/generated/proto/sentence";
import SentenceCompositeItem from "@/components/sentence/SentenceCompositeItem";
import SentenceForm from "@/components/sentence/SentenceForm";
import { ModalLayout } from "@/components/ui/modal/ModalLayout";
import ModalProvider from "@/components/ui/modal/ModalProvider";
import { createSentenceAction } from "@/app/actions/sentence";
import { Link } from "@/i18n/routing";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SentenceListPage({
  sentenceList,
}: {
  sentenceList: SentenceComposite[];
}) {
  const t = useTranslations();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-1 flex items-center justify-between border-b border-gray-04 bg-black px-4 py-3">
        <h1 className="text-lg font-semibold text-white">
          {t("sentence.listTitle")}
        </h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {t("common.new")}
        </button>
      </div>

      {sentenceList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-03">{t("sentence.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-4">
          {sentenceList.map((item) =>
            item.sentence ? (
              <Link
                key={item.sentence.id}
                href={`/sentence/${item.sentence.id}`}
              >
                <SentenceCompositeItem
                  display="card"
                  sentence={item.sentence}
                  wordList={item.wordList}
                />
              </Link>
            ) : null,
          )}
        </div>
      )}

      <ModalProvider>
        {isFormOpen && (
          <ModalLayout
            modalType="bottom-to-top"
            closeModal={() => setIsFormOpen(false)}
          >
            <div className="p-2">
              <h2 className="px-4 pt-2 text-base font-semibold text-white">
                {t("sentence.newTitle")}
              </h2>
              <SentenceForm
                onSubmit={async (text) => {
                  await createSentenceAction(text);
                  setIsFormOpen(false);
                }}
              />
            </div>
          </ModalLayout>
        )}
      </ModalProvider>
    </div>
  );
}
