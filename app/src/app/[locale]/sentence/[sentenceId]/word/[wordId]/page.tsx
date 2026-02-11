import { getWord } from "@/db/service/word";
import WordDetailContent from "./WordDetailContent";

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ sentenceId: string; wordId: string }>;
}) {
  const { sentenceId, wordId } = await params;
  const word = await getWord({ where: { id: Number(wordId) } });

  return <WordDetailContent word={word} sentenceId={Number(sentenceId)} />;
}
