"use client";

import type { ComponentProps } from "react";
import dynamic from "next/dynamic";
import { cn } from "~/lib/utils";

const Root = dynamic(() =>
  import("@radix-ui/react-separator").then((m) => m.Root),
);

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ref,
  ...props
}: ComponentProps<typeof Root>) {
  return (
    <Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
