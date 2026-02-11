import { getSentence } from "@/db/service/sentence";
import UpdateSentenceForm from "./UpdateSentenceForm";

export default async function UpdateSentencePage({
  params,
}: {
  params: Promise<{ sentenceId: string }>;
}) {
  const { sentenceId } = await params;
  const sentenceComposite = await getSentence({
    where: { id: Number(sentenceId) },
  });

  return <UpdateSentenceForm sentenceComposite={sentenceComposite} />;
}
