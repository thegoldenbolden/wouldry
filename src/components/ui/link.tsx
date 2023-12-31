import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { type ButtonVariants, Button } from "~/components/ui/button";
import type { ComponentPropsWithRef } from "react";

export type LinkProps = NextLinkProps &
  ComponentPropsWithRef<"a"> &
  ButtonVariants;

function Link({
  className,
  outline,
  fill,
  size,
  ghost,
  prefetch = false,
  ref,
  text,
  children,
  ...props
}: LinkProps) {
  if (!props.href.startsWith("/")) {
    return (
      <Button
        asChild
        outline={outline}
        text={text}
        fill={fill}
        size={size}
        ghost={ghost}
        className={className}
      >
        <a ref={ref} {...props}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      asChild
      outline={outline}
      text={text}
      fill={fill}
      ghost={ghost}
      size={size}
      className={className}
    >
      <NextLink ref={ref} prefetch={prefetch} {...props}>
        {children}
      </NextLink>
    </Button>
  );
}

export { Link };
