import prisma from "@/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { Word } from "@/generated/proto/word";

export async function multiGetWordWithPagination({
  data,
  skip,
  take,
}: {
  data: Omit<Prisma.wordFindManyArgs, "skip" | "take">;
  skip: Prisma.wordFindManyArgs["skip"];
  take: Prisma.wordFindManyArgs["take"];
}): Promise<{
  wordList: Word[];
  numTotalCount: number;
}> {
  const [rows, numTotalCount] = await prisma.$transaction([
    prisma.word.findMany({
      ...data,
      orderBy: {
        create_time: "desc",
      },
      skip,
      take,
    }),
    prisma.word.count({
      where: data.where,
    }),
  ]);

  return {
    wordList: rows.map((row) => Word.fromJSON(row)),
    numTotalCount,
  };
}

export async function getWord({
  where,
}: {
  where: Prisma.wordWhereUniqueInput;
}): Promise<Word> {
  const { wordList } = await multiGetWordWithPagination({
    data: { where },
    skip: 0,
    take: 1,
  });

  if (wordList.length === 0) {
    throw new Error("error.word.notFound");
  }

  return wordList[0];
}

export async function createWord({
  data,
}: {
  data: Prisma.wordUncheckedCreateInput;
}): Promise<Word> {
  return prisma.word.create({ data }).then((row) => Word.fromJSON(row));
}

export async function updateWord({
  where,
  data,
}: {
  where: Prisma.wordWhereUniqueInput;
  data: Prisma.wordUpdateInput;
}): Promise<Word> {
  return prisma.word.update({ where, data }).then((row) => Word.fromJSON(row));
}

export async function deleteWord({
  where,
}: {
  where: Prisma.wordWhereUniqueInput;
}): Promise<Word> {
  return prisma.word.delete({ where }).then((row) => Word.fromJSON(row));
}

export async function toggleWordBookmark({
  where,
}: {
  where: Prisma.wordWhereUniqueInput;
}): Promise<Word> {
  const word = await getWord({ where });

  return prisma.word
    .update({
      where,
      data: { is_bookmarked: !word.isBookmarked },
    })
    .then((row) => Word.fromJSON(row));
}
