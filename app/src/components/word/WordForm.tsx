"use client";

import { useState, useTransition } from "react";
import { Form } from "radix-ui";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WordForm({
  initialText = "",
  sentenceText,
  onSubmit,
}: {
  initialText?: string;
  sentenceText?: string;
  onSubmit: (text: string) => Promise<void>;
}) {
  const t = useTranslations();
  const [text, setText] = useState(initialText);
  const [isPending, startTransition] = useTransition();

  const tokens = sentenceText
    ? sentenceText.split(/(\s+)/).filter(Boolean)
    : [];

  const toggleToken = (token: string) => {
    const currentWords = text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase());
    const normalized = token.toLowerCase();

    if (currentWords.includes(normalized)) {
      const updated = currentWords.filter((w) => w !== normalized).join(" ");
      setText(updated);
    } else {
      setText(text ? `${text} ${token}` : token);
    }
  };

  const isSelected = (token: string) => {
    const currentWords = text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase());
    return currentWords.includes(token.toLowerCase());
  };

  return (
    <Form.Root
      className="flex flex-col gap-4 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await onSubmit(text);
        });
      }}
    >
      {tokens.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-01">
            {t("word.pickFromSentence")}
          </span>
          <div className="flex flex-wrap gap-1.5 rounded-md border border-gray-04 bg-light-black p-3">
            {tokens.map((token, idx) =>
              /^\s+$/.test(token) ? null : (
                <button
                  key={idx}
                  type="button"
                  disabled={isPending}
                  onClick={() => toggleToken(token)}
                  className={`rounded-md px-2 py-1 text-sm transition-colors ${
                    isSelected(token)
                      ? "bg-primary text-black font-medium"
                      : "bg-gray-04 text-gray-01 hover:bg-gray-03 hover:text-white"
                  } disabled:opacity-50`}
                >
                  {token}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      <Form.Field name="text" className="flex flex-col gap-1.5">
        <Form.Label className="text-sm font-medium text-gray-01">
          {t("word.text.title")}
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={isPending}
            placeholder={t("word.text.placeholder")}
            className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </Form.Control>
        <Form.Message match="valueMissing" className="text-xs text-red-400">
          {t("word.text.required")}
        </Form.Message>
      </Form.Field>

      <p className="text-xs text-gray-03">{t("common.aiHint")}</p>

      <Form.Submit asChild>
        <button
          disabled={isPending}
          className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("common.analyzing")}
            </>
          ) : (
            t("common.save")
          )}
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
