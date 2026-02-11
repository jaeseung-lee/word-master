"use client";

import { useState, useTransition } from "react";
import { Form } from "radix-ui";
import { registerAction } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { User } from "@/generated/proto/user";

export default function RegisterForm() {
  const t = useTranslations();
  const [newUser, setNewUser] = useState<User>(User.create());

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-02">
            {t("auth.registerSubtitle")}
          </p>
        </div>

        <Form.Root
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");

            if (newUser.password !== confirmPassword) {
              setError(t("auth.passwordMismatch"));
              return;
            }

            if (newUser.password.length < 6) {
              setError(t("auth.passwordTooShort"));
              return;
            }

            startTransition(async () => {
              const result = await registerAction(
                newUser.name,
                newUser.email,
                newUser.password,
                newUser.openAiApiKey,
              );
              if (result?.error) {
                setError(t("auth.emailAlreadyExists"));
              }
            });
          }}
        >
          {error && (
            <div className="rounded-md bg-red-400/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <Form.Field name="name" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.name")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
                disabled={isPending}
                placeholder={t("auth.namePlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.namePlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Field name="email" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.email")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
                disabled={isPending}
                placeholder={t("auth.emailPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.emailPlaceholder")}
            </Form.Message>
            <Form.Message match="typeMismatch" className="text-xs text-red-400">
              {t("auth.emailPlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Field name="password" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.password")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                disabled={isPending}
                placeholder={t("auth.passwordPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.passwordPlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Field name="confirmPassword" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.confirmPassword")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isPending}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.confirmPasswordPlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Field name="openAiApiKey" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.openAiApiKey")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={newUser.openAiApiKey}
                onChange={(e) =>
                  setNewUser({ ...newUser, openAiApiKey: e.target.value })
                }
                required
                disabled={isPending}
                placeholder={t("auth.openAiApiKeyPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50 font-mono"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.openAiApiKeyPlaceholder")}
            </Form.Message>
            <p className="text-xs text-gray-03">{t("auth.openAiApiKeyHint")}</p>
          </Form.Field>

          <Form.Submit asChild>
            <button
              disabled={isPending}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("auth.registering")}
                </>
              ) : (
                t("auth.register")
              )}
            </button>
          </Form.Submit>
        </Form.Root>

        <p className="mt-6 text-center text-sm text-gray-02">
          {t("auth.hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
