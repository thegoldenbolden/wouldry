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
      className={cn("relative overflow-hidden rounded-md size-10", className)}
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
        "flex h-full w-full p-1 items-center justify-center rounded-inherit bg-background text-copy-light",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
