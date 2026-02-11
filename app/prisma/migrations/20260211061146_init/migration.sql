-- CreateTable
CREATE TABLE "sentence" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sentence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "definition" TEXT NOT NULL,
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "sentence_id" INTEGER NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sentence_text_idx" ON "sentence"("text");

-- CreateIndex
CREATE INDEX "sentence_is_bookmarked_idx" ON "sentence"("is_bookmarked");

-- CreateIndex
CREATE INDEX "word_text_idx" ON "word"("text");

-- CreateIndex
CREATE INDEX "word_is_bookmarked_idx" ON "word"("is_bookmarked");

-- AddForeignKey
ALTER TABLE "word" ADD CONSTRAINT "word_sentence_id_fkey" FOREIGN KEY ("sentence_id") REFERENCES "sentence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
