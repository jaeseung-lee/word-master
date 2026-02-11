import { multiGetSentenceWithPagination } from "@/db/service/sentence";
import SentenceListPage from "./SentenceListPage";

export default async function Home() {
  const { sentenceList } = await multiGetSentenceWithPagination({
    data: {},
    skip: 0,
    take: 50,
  });

  return <SentenceListPage sentenceList={sentenceList} />;
}
