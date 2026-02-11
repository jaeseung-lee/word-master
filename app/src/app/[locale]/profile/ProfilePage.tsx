"use client";

import { useState, useTransition } from "react";
import { Form } from "radix-ui";
import { updateProfileAction, changePasswordAction } from "@/app/actions/user";
import { ArrowLeft, Loader2, Check, Eye, EyeOff } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ProfilePage({
  initialName,
  initialEmail,
  initialOpenAiApiKey,
}: {
  initialName: string;
  initialEmail: string;
  initialOpenAiApiKey: string;
}) {
  const t = useTranslations();

  // 프로필 정보
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [openAiApiKey, setOpenAiApiKey] = useState(initialOpenAiApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isProfilePending, startProfileTransition] = useTransition();

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordPending, startPasswordTransition] = useTransition();

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      {/* 헤더 */}
      <div className="sticky top-0 z-1 flex items-center gap-3 border-b border-gray-04 bg-black px-4 py-3">
        <Link href="/dashboard">
          <ArrowLeft className="h-5 w-5 text-gray-02 hover:text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">
          {t("profile.title")}
        </h1>
      </div>

      <div className="flex flex-col gap-6 p-4">
        {/* 프로필 정보 섹션 */}
        <Form.Root
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setProfileMessage("");
            setProfileError("");
            startProfileTransition(async () => {
              try {
                await updateProfileAction({ name, email, openAiApiKey });
                setProfileMessage(t("profile.saved"));
              } catch (err: any) {
                setProfileError(t("auth.emailAlreadyExists"));
              }
            });
          }}
        >
          <h2 className="text-sm font-semibold text-gray-01">
            {t("profile.infoSection")}
          </h2>

          {profileMessage && (
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
              <Check className="h-4 w-4" />
              {profileMessage}
            </div>
          )}
          {profileError && (
            <div className="rounded-md bg-red-400/10 px-3 py-2 text-sm text-red-400">
              {profileError}
            </div>
          )}

          <Form.Field name="name" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.name")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isProfilePending}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isProfilePending}
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

          <Form.Field name="openAiApiKey" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.openAiApiKey")}
            </Form.Label>
            <div className="relative">
              <Form.Control asChild>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={openAiApiKey}
                  onChange={(e) => setOpenAiApiKey(e.target.value)}
                  required
                  disabled={isProfilePending}
                  placeholder={t("auth.openAiApiKeyPlaceholder")}
                  className="w-full rounded-md border border-gray-04 bg-light-black px-3 py-2 pr-10 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50 font-mono"
                />
              </Form.Control>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-03 hover:text-gray-01"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.openAiApiKeyPlaceholder")}
            </Form.Message>
            <p className="text-xs text-gray-03">{t("auth.openAiApiKeyHint")}</p>
          </Form.Field>

          <Form.Submit asChild>
            <button
              disabled={isProfilePending}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isProfilePending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("profile.saving")}
                </>
              ) : (
                t("common.save")
              )}
            </button>
          </Form.Submit>
        </Form.Root>

        <div className="h-px bg-gray-04" />

        {/* 비밀번호 변경 섹션 */}
        <Form.Root
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setPasswordMessage("");
            setPasswordError("");

            if (newPassword !== confirmNewPassword) {
              setPasswordError(t("auth.passwordMismatch"));
              return;
            }

            if (newPassword.length < 6) {
              setPasswordError(t("auth.passwordTooShort"));
              return;
            }

            startPasswordTransition(async () => {
              try {
                await changePasswordAction(currentPassword, newPassword);
                setPasswordMessage(t("profile.passwordChanged"));
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
              } catch (err: any) {
                setPasswordError(t("profile.currentPasswordInvalid"));
              }
            });
          }}
        >
          <h2 className="text-sm font-semibold text-gray-01">
            {t("profile.passwordSection")}
          </h2>

          {passwordMessage && (
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
              <Check className="h-4 w-4" />
              {passwordMessage}
            </div>
          )}
          {passwordError && (
            <div className="rounded-md bg-red-400/10 px-3 py-2 text-sm text-red-400">
              {passwordError}
            </div>
          )}

          <Form.Field name="currentPassword" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("profile.currentPassword")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isPasswordPending}
                placeholder={t("profile.currentPasswordPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("profile.currentPasswordPlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Field name="newPassword" className="flex flex-col gap-1.5">
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("profile.newPassword")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isPasswordPending}
                placeholder={t("profile.newPasswordPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("profile.newPasswordPlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Field
            name="confirmNewPassword"
            className="flex flex-col gap-1.5"
          >
            <Form.Label className="text-sm font-medium text-gray-01">
              {t("auth.confirmPassword")}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isPasswordPending}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                className="rounded-md border border-gray-04 bg-light-black px-3 py-2 text-sm text-white placeholder:text-gray-03 focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-xs text-red-400">
              {t("auth.confirmPasswordPlaceholder")}
            </Form.Message>
          </Form.Field>

          <Form.Submit asChild>
            <button
              disabled={isPasswordPending}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("profile.saving")}
                </>
              ) : (
                t("profile.changePassword")
              )}
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
}
