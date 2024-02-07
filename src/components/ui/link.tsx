import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithRef } from "react";
import { buttonVariants, type ButtonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type LinkProps = NextLinkProps &
  ComponentPropsWithRef<"a"> &
  ButtonVariants;

export function Link({
  className,
  fill,
  size,
  prefetch = false,
  outline,
  ref,
  ghost,
  text,
  children,
  ...props
}: LinkProps) {
  const cName = cn(
    buttonVariants({ fill, text, ghost, outline, size }),
    "p-0",
    className,
  );

  if (!props.href.startsWith("/")) {
    return (
      <a ref={ref} className={cName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink ref={ref} className={cName} prefetch={prefetch} {...props}>
      {children}
    </NextLink>
  );
}
