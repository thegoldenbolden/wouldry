"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Button, type ButtonProps } from "~/components/ui/button";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { Sun, Moon, Laptop, Palette } from "~/components/icons";
import { Skeleton } from "~/components/ui/skeleton";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

type ToggleProps = ButtonProps & {
  iconProps?: React.ComponentProps<typeof Sun>;
};

const icons = {
  light: Sun,
  dark: Moon,
  system: Laptop,
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      disableTransitionOnChange
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function ThemeToggle({ iconProps, ...props }: ToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme, themes } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton className={cn("bg-copy/5", props.className)}>
        <svg {...iconProps} />
      </Skeleton>
    );
  }

  const Icon = icons[theme as keyof typeof icons];

  return (
    <Button
      {...props}
      onClick={() => {
        const currentThemeIdx = themes.findIndex((t) => t == theme);
        if (currentThemeIdx === -1 || currentThemeIdx === themes.length - 1) {
          setTheme(themes[0]);
        } else {
          setTheme(themes[currentThemeIdx + 1]);
        }
      }}
    >
      {Icon ? <Icon {...iconProps} /> : <Palette {...iconProps} />}
    </Button>
  );
}
