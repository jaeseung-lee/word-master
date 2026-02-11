"use client";

import { useRef, useState, useTransition } from "react";
import { Form } from "radix-ui";
import { Loader2, ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { extractTextFromImageAction } from "@/app/actions/sentence";

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
  const [isExtracting, startExtracting] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      const mimeType = file.type;

      startExtracting(async () => {
        const extracted = await extractTextFromImageAction(base64, mimeType);
        setText((prev) => (prev ? prev + "\n" + extracted : extracted));
      });
    };
    reader.readAsDataURL(file);

    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const isDisabled = isPending || isExtracting;

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
        <div className="flex items-center justify-between">
          <Form.Label className="text-sm font-medium text-gray-01">
            {t("sentence.text.title")}
          </Form.Label>
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md border border-gray-04 px-2.5 py-1 text-xs text-gray-02 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {isExtracting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            {isExtracting ? t("common.extracting") : t("common.uploadImage")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <Form.Control asChild>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={isDisabled}
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
          disabled={isDisabled}
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
