import { Sentence } from "@/generated/proto/sentence";
import { Word } from "@/generated/proto/word";

export default function SentenceCompositeItem({
  sentence,
  wordList,
}: {
  sentence: Sentence;
  wordList: Word[];
}) {
  return <div>{sentence.text}</div>;
}
