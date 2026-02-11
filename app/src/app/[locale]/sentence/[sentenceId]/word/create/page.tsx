import CreateWordForm from "./CreateWordForm";
import { getSentence } from "@/db/service/sentence";

export default async function CreateWordPage({
  params,
}: {
  params: Promise<{ sentenceId: string }>;
}) {
  const { sentenceId } = await params;
  const sentenceComposite = await getSentence({
    where: { id: Number(sentenceId) },
  });

  return (
    <CreateWordForm
      sentenceId={Number(sentenceId)}
      sentenceText={sentenceComposite.sentence?.text ?? ""}
    />
  );
}
