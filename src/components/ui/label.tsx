"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

const Root = dynamic(() => import("@radix-ui/react-label").then((m) => m.Root));

function Label({ className, ref, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      ref={ref}
      className={cn(
        "text-xs font-semibold uppercase tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
