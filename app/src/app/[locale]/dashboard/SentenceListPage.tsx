"use client";

import { useState } from "react";
import { SentenceComposite } from "@/generated/proto/sentence";
import SentenceCompositeItem from "@/components/sentence/SentenceCompositeItem";
import SentenceForm from "@/components/sentence/SentenceForm";
import { ModalLayout } from "@/components/ui/modal/ModalLayout";
import ModalProvider from "@/components/ui/modal/ModalProvider";
import { createSentenceAction } from "@/app/actions/sentence";
import { Link } from "@/i18n/routing";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SentenceListPage({
  sentenceList,
  currentPage,
  totalPages,
}: {
  sentenceList: SentenceComposite[];
  currentPage: number;
  totalPages: number;
}) {
  const t = useTranslations();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 현재 페이지 기준으로 표시할 페이지 번호 계산 (최대 5개)
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

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
        <div className="flex flex-1 flex-col gap-2 p-4">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 flex items-center justify-center gap-1 border-t border-gray-04 bg-black px-4 py-3">
          <Link
            href={
              currentPage > 1
                ? `/dashboard?page=${currentPage - 1}`
                : "/dashboard?page=1"
            }
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              currentPage <= 1
                ? "pointer-events-none text-gray-04"
                : "text-gray-02 hover:bg-gray-04 hover:text-white"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          {pageNumbers[0] > 1 && (
            <>
              <Link
                href="/dashboard?page=1"
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-gray-02 transition-colors hover:bg-gray-04 hover:text-white"
              >
                1
              </Link>
              {pageNumbers[0] > 2 && (
                <span className="flex h-8 w-8 items-center justify-center text-sm text-gray-03">
                  ...
                </span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <Link
              key={page}
              href={`/dashboard?page=${page}`}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
                page === currentPage
                  ? "bg-primary font-semibold text-black"
                  : "text-gray-02 hover:bg-gray-04 hover:text-white"
              }`}
            >
              {page}
            </Link>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="flex h-8 w-8 items-center justify-center text-sm text-gray-03">
                  ...
                </span>
              )}
              <Link
                href={`/dashboard?page=${totalPages}`}
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-gray-02 transition-colors hover:bg-gray-04 hover:text-white"
              >
                {totalPages}
              </Link>
            </>
          )}

          <Link
            href={
              currentPage < totalPages
                ? `/dashboard?page=${currentPage + 1}`
                : `/dashboard?page=${totalPages}`
            }
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              currentPage >= totalPages
                ? "pointer-events-none text-gray-04"
                : "text-gray-02 hover:bg-gray-04 hover:text-white"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
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
