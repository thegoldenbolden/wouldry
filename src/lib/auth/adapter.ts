import "server-only";

import { createId, createDisplayName } from "~/db/utils";
import type { Adapter } from "@auth/core/adapters";
import db from "~/db";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    image: string;
    accentColor?: string;
  }
}

export const createUser: Adapter["createUser"] = async (user) => {
  return await db.user.create({
    data: {
      id: createId(),
      image: user.image,
      email: user.email,
      accentColor: user.accentColor,
      emailVerified: user.emailVerified,
      name: createDisplayName(user.name),
      username: createId({
        underscore: false,
        uppercase: false,
        size: 16,
      }),
    },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      username: true,
      name: true,
      image: true,
      accentColor: true,
    },
  });
};

export const getUser: Adapter["getUser"] = async (id) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      username: true,
      name: true,
      image: true,
    },
  });
  return user || null;
};

export const getUserByEmail: Adapter["getUserByEmail"] = async (email) => {
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      username: true,
      name: true,
      image: true,
    },
  });
  return user || null;
};

export const getUserByAccount: Adapter["getUserByAccount"] = async (
  provider_providerAccountId,
) => {
  const account = await db.account.findUnique({
    where: { provider_providerAccountId },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          emailVerified: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return account?.user || null;
};

export const updateUser: Adapter["updateUser"] = ({
  image,
  accentColor,
  name,
  ...newValues
}) => {
  return db.user.update({
    where: { id: newValues.id },
    data: {
      ...newValues,
      ...(name && { name: createDisplayName(name) }),
      ...(image && { image }),
      ...(accentColor && { accentColor }),
    },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      username: true,
      name: true,
      image: true,
    },
  });
};

export const deleteUser: Adapter["deleteUser"] = async (id) => {
  await db.user.delete({ where: { id } });
};

export const linkAccount: Adapter["linkAccount"] = async (account) => {
  await db.account.create({
    data: {
      ...account,
      id: createId(),
    },
  });
};

export const unlinkAccount: Adapter["unlinkAccount"] = async (
  provider_providerAccountId,
) => {
  await db.account.delete({ where: { provider_providerAccountId } });
};

export const createSession: Adapter["createSession"] = (session) => {
  return db.session.create({
    data: {
      ...session,
      id: createId(),
    },
  });
};

export const getSessionAndUser: Adapter["getSessionAndUser"] = async (
  sessionToken,
) => {
  const data = await db.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          emailVerified: true,
          image: true,
          username: true,
          name: true,
        },
      },
    },
  });
  if (!data) return null;
  const { user, ...session } = data;
  return { session, user };
};

export const updateSession: Adapter["updateSession"] = ({
  sessionToken,
  expires,
}) => {
  return db.session.update({
    where: { sessionToken },
    data: { expires, sessionToken },
  });
};

export const deleteSession: Adapter["deleteSession"] = async (sessionToken) => {
  await db.session.delete({ where: { sessionToken } });
};
