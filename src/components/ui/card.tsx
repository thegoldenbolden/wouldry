import type { ComponentPropsWithRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "~/lib/utils";

type CardProps = ComponentPropsWithRef<"div"> & {
  asChild?: boolean;
};

function Card({ className, asChild = false, ref, ...props }: CardProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "group/card rounded-md drop-shadow-md p-2 bg-background text-copy",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export { type CardProps, Card };
