"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Avatar({
  className,
  ref,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative size-10 overflow-hidden rounded-md", className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ref,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  if (!props.src) {
    return null;
  }

  if (!props.alt) {
    console.warn("MISSING_ALT_TAG");
  }

  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("h-full w-full rounded-inherit", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ref,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center bg-background p-1 text-foreground-light",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
