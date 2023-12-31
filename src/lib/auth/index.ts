import "server-only";

import { getDiscordAvatarUrl, getTwitchChatColor } from "~/lib/auth/utils";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import TwitchProvider from "next-auth/providers/twitch";
import {
  decimalToHex,
  getAvatarUrl,
  getColor,
  getRandomAvatar,
} from "~/lib/utils";
import * as Adapter from "~/lib/auth/adapter";
import { links } from "~/lib/links";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      image: string;
      username: string;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: Adapter,
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: links.login.href,
    signOut: links.logout.href,
    newUser: links.settingsProfile.href,
  },
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID ?? "",
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? "",
      account(account) {
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          scope: account.scope,
          token_type: account.token_type,
        };
      },
      profile(profile) {
        let image = getDiscordAvatarUrl(profile.id, profile.avatar);
        let accentColor = decimalToHex(getColor(profile.accent_color));
        const name = profile.global_name || profile.username;

        if (!image) {
          const { url, color } = getRandomAvatar();
          (image = url), (accentColor = color);
        }

        return {
          image,
          name,
          id: profile.id,
          email: profile.email,
          accentColor,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      account(account) {
        return {
          id_token: account.id_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          scope: account.scope,
          token_type: account.token_type,
        };
      },
      profile(profile) {
        let image = getAvatarUrl(profile.image);

        return {
          id: profile.sub,
          image: image.url,
          name: profile.name,
          accentColor: image.color,
        };
      },
    }),
    TwitchProvider({
      clientId: process.env.AUTH_TWITCH_ID ?? "",
      clientSecret: process.env.AUTH_TWITCH_SECRET ?? "",
      account(tokens) {
        return {
          access_token: tokens.access_token,
          expires_at: tokens.expires_at,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
        };
      },
      async profile(profile, tokens) {
        const image = getAvatarUrl(profile.picture);

        if (image.color === "#1f8fff") {
          image.color = await getTwitchChatColor(
            profile.sub,
            tokens.access_token,
          );
        }

        return {
          id: profile.sub,
          email: profile.email,
          name: profile.preferred_username,
          image: image.url,
          accentColor: image.color,
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user: { email, emailVerified, ...user } }) {
      return { ...session, user };
    },
  },
});
