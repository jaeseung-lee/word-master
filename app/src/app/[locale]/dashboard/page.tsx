import { multiGetSentenceWithPagination } from "@/db/service/sentence";
import SentenceListPage from "./SentenceListPage";

const PAGE_SIZE = 10;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const { sentenceList, numTotalCount } = await multiGetSentenceWithPagination({
    data: {},
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(numTotalCount / PAGE_SIZE));

  return (
    <SentenceListPage
      sentenceList={sentenceList}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
