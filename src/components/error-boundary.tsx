"use client";

import type { ComponentProps } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorBoundary,
} from "react-error-boundary";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

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
          "flex flex-col items-center justify-center gap-4",
          props.className,
        )}
      >
        <p className="font-chillax text-lg font-medium leading-none">
          Something went wrong
        </p>
        <Button
          className="py-1"
          outline="foreground"
          onClick={() => resetBoundary()}
        >
          Try again?
        </Button>
      </div>
    );
  }

  return (
    <div {...props}>
      {children}
      <Button
        className="py-1"
        outline="foreground"
        onClick={() => resetBoundary()}
      >
        Try again?
      </Button>
    </div>
  );
}
