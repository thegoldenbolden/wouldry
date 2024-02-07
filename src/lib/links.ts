import {
  BlankFile,
  Cog,
  Collection,
  Cookie,
  Discord,
  Home,
  Lock,
  Login,
  Pencil,
  PowerOff,
  Search,
  User,
} from "~/components/icons";

export const links = {
  settings: {
    title: "Settings",
    href: "/settings",
    icon: Cog,
  },
  settingsAccount: {
    title: "Account settings",
    href: "/settings/account",
    icon: Cog,
  },
  settingsProfile: {
    title: "Profile settings",
    href: "/settings/profile",
    icon: User,
  },
  login: {
    title: "Sign in",
    href: "/login",
    icon: Login,
  },
  logout: {
    title: "Sign out",
    href: "/logout",
    icon: PowerOff,
  },
  create: {
    title: "Create",
    href: "/create",
    icon: Pencil,
  },
  discord: {
    href: "https://discord.gg/DwhDsewWCk",
    title: "Discord",
    icon: Discord,
  },
  search: {
    href: "/search",
    title: "Search",
    icon: Search,
  },
  searchPolls: {
    root: "/search",
    href: "/search/polls",
    title: "Polls",
    icon: Search,
  },
  searchUsers: {
    root: "/search",
    href: "/search/users",
    title: "Users",
    icon: Search,
  },
  home: {
    title: "Home",
    href: "/",
    icon: Home,
  },
  terms: {
    title: "Terms of Service",
    href: "/terms",
    icon: BlankFile,
  },
  cookies: {
    title: "Cookie Policy",
    href: "/cookies",
    icon: Cookie,
  },
  privacy: {
    title: "Privacy Policy",
    href: "/privacy",
    icon: Lock,
  },
  profile: {
    href: (username: string) => `/@${username}`,
    title: "Profile",
    icon: User,
  },
  or: {
    href: (slug = "", number = 0) => `/or/${slug}-${number}`,
    title: "Or",
    icon: Collection,
  },
};
