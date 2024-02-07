import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AVATAR_COLORS, CLOUDINARY_URL } from "~/lib/constants";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomColor = () => {
  return getRandomNumber(0, 16_777_215);
};

export const getColor = (color?: number | null) => {
  return color ?? getRandomColor();
};

export const decimalToHex = (number: number) => {
  return `#${number.toString(16)}`;
};

export const hexToDecimal = (string: string) => {
  return parseInt(string, 16);
};

export const getAvatarUrl = (url?: string | null) => {
  return url ? { url, color: "#1f8fff" } : getRandomAvatar();
};

export const getRandomAvatar = () => {
  const totalAvatars = Object.keys(AVATAR_COLORS).length;
  const id = getRandomNumber(0, totalAvatars);
  return {
    url: `${CLOUDINARY_URL}/avatars/${id}.png`,
    color: AVATAR_COLORS[id],
  };
};

export const setBorderColor = (color?: string | null) => {
  return { borderColor: color || "#1f8fff" };
};

export const getRandomHex = (): `#${string}` => {
  const alphabet = "0123456789abcdef";
  let hex = "";

  for (let i = 0; i < 6; i++) {
    let a = Math.floor(Math.random() * alphabet.length);
    hex += a;
  }

  return `#${hex}`;
};

type Fetcher<JSON = any> = (
  info: RequestInfo,
  init?: RequestInit,
) => Promise<JSON>;

export const fetcher: Fetcher = async (...args) => {
  const res = await fetch(...args);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
};
