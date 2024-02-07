import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithRef } from "react";
import { cn } from "~/lib/utils";

type CardProps = ComponentPropsWithRef<"div"> & {
  asChild?: boolean;
};

function Card({ className, asChild = false, ref, ...props }: CardProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "group/card rounded-md bg-card p-2 text-card-foreground",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export { Card, type CardProps };
