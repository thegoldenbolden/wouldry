import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cn } from "~/lib/utils";

function SectionRoot({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("flex flex-col gap-3", className)} {...props} />
  );
}

function Title({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("font-chillax text-3xl font-medium", className)}
      {...props}
    />
  );
}

type ContentProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
};

function Content({ asChild, className, ...props }: ContentProps) {
  const Comp = asChild ? Slot : "div";

  return <Comp className={cn("", className)} {...props} />;
}

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return <header className={cn("", className)} {...props} />;
}

export const Section = Object.assign(SectionRoot, {
  Title,
  Content,
  Header,
});
