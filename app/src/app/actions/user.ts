"use server";

import {
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "@/db/service/user";
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

export async function updateUserAction(
  id: number,
  data: { name?: string; email?: string; password?: string },
) {
  if (data.email) {
    const existingUser = await getUserByEmail({ email: data.email });
    if (existingUser && existingUser.id !== id) {
      throw new Error("error.user.emailAlreadyExists");
    }
  }

  await updateUser({
    where: { id },
    data,
  });

  revalidatePath("/");
}

export async function deleteUserAction(id: number) {
  await deleteUser({ where: { id } });

  revalidatePath("/");
}
