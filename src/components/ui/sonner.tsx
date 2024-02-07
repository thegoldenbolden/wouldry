"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          info: "group toast group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          success:
            "group toast group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          error:
            "group toast group-[.toaster]:bg-error group-[.toaster]:text-error-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          warning:
            "group toast group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground-light",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-border group-[.toast]:text-foreground-lighter",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
