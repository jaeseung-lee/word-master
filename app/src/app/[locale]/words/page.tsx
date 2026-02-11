import { multiGetWordWithPagination } from "@/db/service/word";
import WordListPage from "./WordListPage";

export default async function WordsPage() {
  const { wordList } = await multiGetWordWithPagination({
    data: {},
    skip: 0,
    take: 50,
  });

  return <WordListPage wordList={wordList} />;
}
