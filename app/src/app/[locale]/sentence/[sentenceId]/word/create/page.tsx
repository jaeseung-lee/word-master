import CreateWordForm from "./CreateWordForm";

export default async function CreateWordPage({
  params,
}: {
  params: Promise<{ sentenceId: string }>;
}) {
  const { sentenceId } = await params;

  return <CreateWordForm sentenceId={Number(sentenceId)} />;
}
