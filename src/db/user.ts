import { Prisma } from "@prisma/client";
import type {
  DatabaseSession,
  DatabaseUser,
  RegisteredDatabaseUserAttributes,
} from "lucia";
import { parse } from "valibot";
import { db } from "~/db/client";
import { createPage } from "~/db/utils";
import { IdSchema, type IdOutput } from "./validations";
import {
  CreateOAuthAccountSchema,
  CreateUserSchema,
  EmailSchema,
  MIN_USERS_PER_PAGE,
  OAuthAccountSchema,
  SearchOutput,
  UpdateUserOutput,
  type CreateOAuthAccountOutput,
  type CreateUserOutput,
  type EmailOutput,
  type OAuthAccountOutput,
} from "./validations/user";

export function createOAuthAccount(data: CreateOAuthAccountOutput) {
  const schema = parse(CreateOAuthAccountSchema, data);

  return db.account.create({
    data: {
      id: schema.id,
      image: schema.image,
      nickname: schema.nickname,
      username: schema.username,
      provider: schema.provider,
      providerUserId: schema.providerUserId,
      scope: null,
      userId: schema.userId,
    },
  });
}

export async function createSession(session: DatabaseSession) {
  await db.session.create({
    data: {
      ...session.attributes,
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    },
  });
}

export function createUser(data: CreateUserOutput) {
  const schema = parse(CreateUserSchema, data);
  return db.user.create({
    data: {
      ...schema,
      emailVerified: null,
    },
  });
}

export async function deleteExpiredSessions() {
  await db.session.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}

export async function deleteSession(id: string) {
  try {
    await db.session.delete({
      where: {
        id,
      },
    });
  } catch {}
}

export async function deleteUserSessions(userId: string) {
  await db.session.deleteMany({
    where: { userId },
  });
}

export async function deleteUser(id: string) {
  await db.user.update({
    where: { id },
    data: {
      comments: {
        set: [],
      },
      rathers: {
        set: [],
      },
    },
  });

  const user = await db.user.delete({
    where: { id },
    select: { username: true },
  });

  return {
    data: {
      user,
    },
  };
}

export async function getEmail(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      email: true,
      emailVerified: true,
    },
  });
  return {
    data: {
      user,
    },
  };
}

export async function getProfileByUsername(username: string) {
  const user = await db.user.findUnique({
    where: { username, isDeleted: false },
    select: {
      about: true,
      image: true,
      username: true,
      nickname: true,
    },
  });

  if (!user) {
    return {
      data: null,
    };
  }

  return {
    data: {
      user,
    },
  };
}

export async function getRecentUsers() {
  const users = await db.user.findMany({
    take: 12,
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    select: {
      image: true,
      username: true,
      nickname: true,
      about: true,
    },
  });

  return {
    data: {
      users,
    },
  };
}

export async function getSessionAndUser(
  sessionId: string,
): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
  const res = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true,
    },
  });

  if (!res) {
    return [null, null];
  }

  const { user, ...session } = res;
  const {
    id: session_id,
    userId: session_user_id,
    expiresAt,
    ...session_attributes
  } = session;

  return [
    {
      id: session_id,
      userId: session_user_id,
      expiresAt,
      attributes: session_attributes,
    },
    {
      id: user.id,
      attributes: user,
    },
  ];
}

export const getTotalUsers = async () => {
  const total = await db.user.count({
    where: {
      isDeleted: false,
    },
  });

  return {
    data: {
      total,
    },
  };
};

export async function getUserByEmail(data: EmailOutput) {
  const schema = parse(EmailSchema, data);

  const user = await db.user.findUnique({
    where: { email: schema.email },
    select: {
      id: true,
      username: true,
      nickname: true,
      image: true,
      about: true,
      accounts: {
        select: {
          provider: true,
          providerUserId: true,
        },
      },
    },
  });

  return user;
}

export async function getUserByOAuthAccount(data: OAuthAccountOutput) {
  const schema = parse(OAuthAccountSchema, data);

  const account = await db.account.findUnique({
    where: {
      provider_providerUserId: {
        provider: schema.provider,
        providerUserId: schema.providerUserId,
      },
    },
    select: {
      provider: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          nickname: true,
          image: true,
          about: true,
        },
      },
    },
  });

  return account || null;
}

export async function getUserSessions(
  userId: string,
): Promise<DatabaseSession[]> {
  const sessions = await db.session.findMany({
    where: {
      userId,
    },
  });

  return sessions.map(({ id, userId, expiresAt, ...attributes }) => {
    return {
      id,
      userId,
      expiresAt,
      attributes,
    };
  });
}

export async function getUser(data: IdOutput) {
  const schema = parse(IdSchema, data);

  const user = await db.user.findUnique({
    where: { id: schema.id },
    select: {
      id: true,
      username: true,
      nickname: true,
      image: true,
      about: true,
    },
  });

  return user;
}

export async function getUsers(
  data: SearchOutput = {
    limit: MIN_USERS_PER_PAGE,
    sort: "desc",
    orderBy: "created_at",
  },
) {
  let where: Prisma.UserWhereInput = { isDeleted: false };
  let cursor: Prisma.UserWhereUniqueInput | undefined;

  if (data.before && !data.after) {
    cursor = { id: data.before };
  } else if (data.after && !data.before) {
    cursor = { id: data.after };
  }

  // If searching previous page, set take to a negative value.
  const take = data.before ? -data.limit : data.limit;

  // If a cursor exists, skip the cursor in result.
  const skip = cursor ? 1 : undefined;
  if (data.username) {
    where = {
      ...where,
      username: data.username,
    };
  }

  const users = await db.user.findMany({
    cursor,
    where,
    take,
    skip,
    orderBy: { createdAt: data.sort },
    select: {
      id: true,
      image: true,
      username: true,
      nickname: true,
      about: true,
    },
  });

  return {
    data: {
      ...createPage({
        initialPage: !cursor,
        lastItemId: users[users.length - 1]?.id,
        firstItemId: users[0]?.id,
        totalItems: users.length,
        itemsPerPage: data.limit,
      }),
      results: users,
    },
  };
}

export async function updateSessionExpiration(
  sessionId: string,
  expiresAt: Date,
) {
  await db.session.update({
    where: {
      id: sessionId,
    },
    data: {
      expiresAt,
    },
  });
}

export async function updateUser(
  user: RegisteredDatabaseUserAttributes,
  data: UpdateUserOutput,
) {
  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      about: data.about,
      nickname: data.nickname,
      ...(data.username?.toLowerCase() !== user.username?.toLowerCase() && {
        username: data.username,
      }),
    },
  });

  return {
    data: {
      user: updated,
    },
  };
}
