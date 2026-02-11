"use client";

import { useState, useTransition } from "react";
import { Form } from "radix-ui";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SentenceForm({
  initialText = "",
  onSubmit,
}: {
  initialText?: string;
  onSubmit: (text: string) => Promise<void>;
}) {
  const t = useTranslations();
  const [text, setText] = useState(initialText);
  const [isPending, startTransition] = useTransition();

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
      <Form.Field name="text" className="flex flex-col gap-1.5">
        <Form.Label className="text-sm font-medium text-gray-01">
          {t("sentence.text.title")}
        </Form.Label>
        <Form.Control asChild>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={isPending}
            rows={3}
            placeholder={t("sentence.text.placeholder")}
            className="resize-none rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </Form.Control>
        <Form.Message match="valueMissing" className="text-xs text-red-400">
          {t("sentence.text.required")}
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
