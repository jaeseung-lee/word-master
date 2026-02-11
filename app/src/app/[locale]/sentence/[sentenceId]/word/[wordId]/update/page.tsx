import { getWord } from "@/db/service/word";
import UpdateWordForm from "./UpdateWordForm";

export default async function UpdateWordPage({
  params,
}: {
  params: Promise<{ sentenceId: string; wordId: string }>;
}) {
  const { sentenceId, wordId } = await params;
  const word = await getWord({ where: { id: Number(wordId) } });

  return <UpdateWordForm word={word} sentenceId={Number(sentenceId)} />;
}
