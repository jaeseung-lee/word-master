import { getSentence } from "@/db/service/sentence";
import SentenceDetailPage from "./SentenceDetailPage";

export default async function SentenceDetail({
  params,
}: {
  params: Promise<{ sentenceId: string }>;
}) {
  const { sentenceId } = await params;
  const sentenceComposite = await getSentence({
    where: { id: Number(sentenceId) },
  });

  return <SentenceDetailPage sentenceComposite={sentenceComposite} />;
}
