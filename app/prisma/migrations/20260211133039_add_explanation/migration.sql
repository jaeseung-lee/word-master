-- AlterTable
ALTER TABLE "sentence" ADD COLUMN     "explanation" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "text" SET DEFAULT '',
ALTER COLUMN "definition" SET DEFAULT '';

-- AlterTable
ALTER TABLE "word" ADD COLUMN     "explanation" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "definition" SET DEFAULT '';
