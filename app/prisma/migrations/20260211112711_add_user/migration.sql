/*
  Warnings:

  - Added the required column `author_id` to the `sentence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Language" ADD VALUE 'LANGUAGE_UNSPECIFIED';

-- AlterTable
ALTER TABLE "sentence" ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "word" ADD COLUMN     "author_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sentence_author_id_idx" ON "sentence"("author_id");

-- CreateIndex
CREATE INDEX "word_author_id_idx" ON "word"("author_id");

-- AddForeignKey
ALTER TABLE "sentence" ADD CONSTRAINT "sentence_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word" ADD CONSTRAINT "word_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
