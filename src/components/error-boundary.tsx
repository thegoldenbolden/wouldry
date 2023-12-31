"use client";

import { Button } from "~/components/ui/button";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorBoundary,
} from "react-error-boundary";

type ErrorBoundaryProps = ComponentProps<"div"> & {
  fallback?: JSX.Element;
};

export function ErrorBoundary({
  children,
  fallback,
  ...props
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary fallback={<Fallback {...props}>{fallback}</Fallback>}>
      {children}
    </ReactErrorBoundary>
  );
}

export function Fallback({ children, ...props }: ComponentProps<"div">) {
  const { resetBoundary } = useErrorBoundary();

  if (!children) {
    return (
      <div
        {...props}
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          props.className,
        )}
      >
        <p>Something went wrong</p>
        <Button className="font-normal" onClick={() => resetBoundary()}>
          Try again?
        </Button>
      </div>
    );
  }

  return (
    <div {...props}>
      {children}
      <button onClick={() => resetBoundary()}>Try again?</button>
    </div>
  );
}
