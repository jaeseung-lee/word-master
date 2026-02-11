import prisma from "@/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { User } from "@/generated/proto/user";

export async function getUser({
  where,
}: {
  where: Prisma.userWhereUniqueInput;
}): Promise<User> {
  const row = await prisma.user.findUnique({ where });

  if (!row) {
    throw new Error("error.user.notFound");
  }

  return User.fromJSON(row);
}

export async function getUserByEmail({
  email,
}: {
  email: string;
}): Promise<User | null> {
  const row = await prisma.user.findFirst({ where: { email } });

  if (!row) {
    return null;
  }

  return User.fromJSON(row);
}

export async function createUser({
  data,
}: {
  data: Prisma.userCreateInput;
}): Promise<User> {
  return prisma.user.create({ data }).then((row) => User.fromJSON(row));
}

export async function updateUser({
  where,
  data,
}: {
  where: Prisma.userWhereUniqueInput;
  data: Prisma.userUpdateInput;
}): Promise<User> {
  return prisma.user.update({ where, data }).then((row) => User.fromJSON(row));
}

export async function deleteUser({
  where,
}: {
  where: Prisma.userWhereUniqueInput;
}): Promise<User> {
  return prisma.user.delete({ where }).then((row) => User.fromJSON(row));
}
