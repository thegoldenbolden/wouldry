import { Lucia } from "lucia";
import "server-only";
import {
  createSession,
  deleteExpiredSessions,
  deleteSession,
  deleteUserSessions,
  getSessionAndUser,
  getUserSessions,
  updateSessionExpiration,
} from "~/db/user";

export const lucia = new Lucia(
  {
    deleteExpiredSessions,
    deleteSession,
    deleteUserSessions,
    getSessionAndUser,
    getUserSessions,
    setSession: createSession,
    updateSessionExpiration,
  },
  {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes(data) {
      return {
        id: data.id,
        username: data.username,
        nickname: data.nickname,
        image: data.image,
      };
    },
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  image: string;
  username: string;
  nickname: string;
}
