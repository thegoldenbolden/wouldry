"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ColorFill, X } from "~/components/icons";
import { Button, type ButtonProps } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

type ToggleProps = Omit<ButtonProps, "className"> & {
  className: {
    button: string;
    swatch: string;
  };
};
export function ThemeToggle({ className, ...props }: ToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme: currentTheme = "system", themes } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton className={cn("bg-foreground/5", className.button)}>
        <span className={className.swatch} />
      </Skeleton>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className={className.button}>
        <ColorFill className={className.swatch} />
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader className="flex-row items-center justify-between gap-2 text-xl font-semibold">
          <span>Theme</span>
          <DialogClose ghost="foreground" className="p-0">
            <X className="size-6" />
          </DialogClose>
        </DialogHeader>
        <ul className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3">
          {themes.map((theme) => {
            return (
              <li key={theme} className={theme}>
                <Button
                  data-active={currentTheme === theme}
                  onClick={() => setTheme(theme)}
                  className="aspect-video w-full rounded-md border border-border bg-background font-chillax font-medium uppercase text-foreground focus-visible:outline-primary data-[active=true]:outline data-[active=true]:outline-2 data-[active=true]:outline-offset-2 data-[active=true]:outline-primary"
                >
                  {theme}
                </Button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
