"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await loginAction(email, password);
      } catch (err: any) {
        setError(t("auth.invalidCredentials"));
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-02">{t("auth.loginSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-red-400/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-01">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
              placeholder={t("auth.emailPlaceholder")}
              className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-01">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
              placeholder={t("auth.passwordPlaceholder")}
              className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("auth.loggingIn")}
              </>
            ) : (
              t("auth.login")
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-02">
          {t("auth.noAccount")}{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            {t("auth.register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
