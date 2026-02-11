import prisma from "@/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { Sentence, SentenceComposite } from "@/generated/proto/sentence";
import { Word } from "@/generated/proto/word";

export async function multiGetSentenceWithPagination({
  data,
  skip,
  take,
}: {
  data: Omit<Prisma.sentenceFindManyArgs, "skip" | "take">;
  skip: Prisma.sentenceFindManyArgs["skip"];
  take: Prisma.sentenceFindManyArgs["take"];
}): Promise<{
  sentenceList: SentenceComposite[];
  numTotalCount: number;
}> {
  const [rows, numTotalCount] = await prisma.$transaction([
    prisma.sentence.findMany({
      ...data,
      include: {
        word_list: true,
      },
      orderBy: {
        create_time: "desc",
      },
      skip,
      take,
    }),
    prisma.sentence.count({
      where: data.where,
    }),
  ]);

  return {
    sentenceList: rows.map((row) => ({
      sentence: Sentence.fromJSON(row),
      wordList: row.word_list.map((word) => Word.fromJSON(word)),
    })),
    numTotalCount,
  };
}

export async function getSentence({
  where,
}: {
  where: Prisma.sentenceWhereUniqueInput;
}): Promise<SentenceComposite> {
  const { sentenceList } = await multiGetSentenceWithPagination({
    data: { where },
    skip: 0,
    take: 1,
  });

  if (sentenceList.length === 0) {
    throw new Error("error.sentence.notFound");
  }

  return sentenceList[0];
}

export async function createSentence({
  data,
}: {
  data: Prisma.sentenceCreateInput;
}): Promise<Sentence> {
  return prisma.sentence.create({ data }).then((row) => Sentence.fromJSON(row));
}

export async function updateSentence({
  where,
  data,
}: {
  where: Prisma.sentenceWhereUniqueInput;
  data: Prisma.sentenceUpdateInput;
}): Promise<Sentence> {
  return prisma.sentence
    .update({ where, data })
    .then((row) => Sentence.fromJSON(row));
}

export async function deleteSentence({
  where,
}: {
  where: Prisma.sentenceWhereUniqueInput;
}): Promise<Sentence> {
  return prisma.sentence
    .delete({ where })
    .then((row) => Sentence.fromJSON(row));
}

export async function toggleSentenceBookmark({
  where,
}: {
  where: Prisma.sentenceWhereUniqueInput;
}): Promise<Sentence> {
  const sentenceComposite = await getSentence({ where });

  return prisma.sentence
    .update({
      where,
      data: { is_bookmarked: !sentenceComposite.sentence?.isBookmarked },
    })
    .then((row) => Sentence.fromJSON(row));
}
