import { multiGetSentenceWithPagination } from "@/db/service/sentence";

export default async function Home() {
  const { sentenceList } = await multiGetSentenceWithPagination({
    data: {},
    skip: 0,
    take: 50,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-8 px-16 py-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Word Master
        </h1>

        {sentenceList.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            등록된 문장이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {sentenceList.map((composite) => (
              <li
                key={composite.sentence?.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="text-lg font-medium text-black dark:text-zinc-50">
                  {composite.sentence?.text}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {composite.sentence?.definition}
                </p>

                {composite.wordList.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {composite.wordList.map((word) => (
                      <li
                        key={word.id}
                        className="rounded-md bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
                      >
                        <span className="font-medium text-black dark:text-zinc-50">
                          {word.text}
                        </span>
                        <span className="ml-1 text-zinc-500 dark:text-zinc-400">
                          {word.definition}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
