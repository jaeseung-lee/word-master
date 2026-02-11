"use server";

import bcrypt from "bcryptjs";
import {
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "@/db/service/user";
import { requireAuth, createSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserAction(id: number) {
  return getUser({ where: { id } });
}

export async function getUserByEmailAction(email: string) {
  return getUserByEmail({ email });
}

export async function createUserAction(
  name: string,
  email: string,
  password: string,
) {
  const existingUser = await getUserByEmail({ email });
  if (existingUser) {
    throw new Error("error.user.emailAlreadyExists");
  }

  await createUser({
    data: {
      name,
      email,
      password,
    },
  });

  revalidatePath("/");
}

export async function updateProfileAction(data: {
  name?: string;
  email?: string;
  openAiApiKey?: string;
}) {
  const session = await requireAuth();

  if (data.email && data.email !== session.email) {
    const existingUser = await getUserByEmail({ email: data.email });
    if (existingUser && existingUser.id !== session.userId) {
      throw new Error("error.user.emailAlreadyExists");
    }
  }

  const updateData: Record<string, string> = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.openAiApiKey !== undefined)
    updateData.open_ai_api_key = data.openAiApiKey;

  await updateUser({
    where: { id: session.userId },
    data: updateData,
  });

  // 이름이나 이메일이 변경되면 세션도 갱신
  if (data.name || data.email) {
    await createSession({
      userId: session.userId,
      email: data.email ?? session.email,
      name: data.name ?? session.name,
    });
  }

  revalidatePath("/profile");
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
) {
  const session = await requireAuth();
  const user = await getUser({ where: { id: session.userId } });

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("error.profile.currentPasswordInvalid");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await updateUser({
    where: { id: session.userId },
    data: { password: hashedPassword },
  });
}

export async function deleteUserAction(id: number) {
  await deleteUser({ where: { id } });

  revalidatePath("/");
}
