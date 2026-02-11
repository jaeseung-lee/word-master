import { Word } from "@/generated/proto/word";

export default function WordItem({ word }: { word: Word }) {
  return <div>{word.text}</div>;
}
