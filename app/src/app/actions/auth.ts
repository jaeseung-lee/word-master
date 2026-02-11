"use server";

import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth";
import { getUserByEmail, createUser } from "@/db/service/user";
import { redirect } from "@/i18n/routing";

export async function loginAction(email: string, password: string) {
  const user = await getUserByEmail({ email });
  if (!user) {
    return { error: "invalidCredentials" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "invalidCredentials" };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  redirect({ href: "/dashboard", locale: "ko" });
}

export async function registerAction(
  name: string,
  email: string,
  password: string,
  openAiApiKey: string,
) {
  const existingUser = await getUserByEmail({ email });
  if (existingUser) {
    return { error: "emailAlreadyExists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUser({
    data: {
      name,
      email,
      password: hashedPassword,
      open_ai_api_key: openAiApiKey,
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  redirect({ href: "/dashboard", locale: "ko" });
}

export async function logoutAction() {
  await deleteSession();
  redirect({ href: "/login", locale: "ko" });
}
