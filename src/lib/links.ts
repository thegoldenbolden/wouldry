export const links = {
  settingsAccount: {
    title: "Account",
    href: "/settings/account",
    initial: "/settings",
  },
  settingsProfile: {
    title: "Settings",
    href: "/settings/profile",
  },
  login: {
    title: "Sign in",
    href: "/login",
  },
  logout: {
    title: "Sign out",
    href: "/logout",
  },
  create: {
    title: "Create",
    href: "/create",
  },
  discord: {
    href: "https://discord.gg/DwhDsewWCk",
    title: "Discord",
  },
  search: {
    href: "/search",
    title: "Search",
  },
  searchRathers: {
    initial: "/search",
    href: "/search/rathers",
    title: "Rathers",
  },
  searchUsers: {
    href: "/search/users",
    title: "Users",
  },
  home: {
    title: "Home",
    href: "/",
  },
  terms: {
    title: "Terms of Service",
    href: "/terms",
  },
  cookies: {
    title: "Cookie Policy",
    href: "/cookies",
  },
  privacy: {
    title: "Privacy Policy",
    href: "/privacy",
  },
  profile: {
    href: (username: string) => `/@${username}`,
    title: "Profile",
  },
  profileRathers: {
    href: (username: string) => links.profile.href(username) + `/rathers`,
    title: "Rathers",
  },
  or: {
    href: (number = 1, slug = "") => `/or/${slug}-${number}`,
  },
} as const;
