"use client";

import { Button, type ButtonProps } from "~/components/ui/button";
import type { ComponentProps } from "react";
import dynamic from "next/dynamic";
import { cn } from "~/lib/utils";

const Dialog = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Root),
);
const Trigger = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Trigger),
);
const Close = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Close),
);

const DialogPortal = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Portal),
);
const Overlay = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Overlay),
);
const Content = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Content),
);
const Title = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Title),
);
const Description = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.DialogDescription),
);

function DialogOverlay({
  className,
  ref,
  ...props
}: ComponentProps<typeof Overlay>) {
  return (
    <Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 radix-state-open:animate-in radix-state-closed:animate-out radix-state-closed:fade-out-0 radix-state-open:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ref,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg border border-border -translate-x-1/2 -translate-y-1/2 gap-4 bg-background p-6 shadow-lg duration-200 radix-state-open:animate-in radix-state-closed:animate-out radix-state-closed:fade-out-0 radix-state-open:fade-in-0 radix-state-closed:zoom-out-95 radix-state-open:zoom-in-95 radix-state-closed:slide-out-to-left-1/2 radix-state-closed:slide-out-to-top-[48%] radix-state-open:slide-in-from-left-1/2 radix-state-open:slide-in-from-top-[48%] sm:rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </Content>
    </DialogPortal>
  );
}

type DialogCloseProps = ButtonProps & ComponentProps<typeof Close>;
function DialogClose({
  className,
  fill,
  outline,
  size,
  ghost,
  text,
  ref,
  ...props
}: DialogCloseProps) {
  return (
    <Button
      asChild
      outline={outline}
      fill={fill}
      text={text}
      size={size}
      ghost={ghost}
      className={className}
    >
      <Close {...props} />
    </Button>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}

function DialogTitle({
  className,
  ref,
  ...props
}: ComponentProps<typeof Title>) {
  return (
    <Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ref,
  ...props
}: ComponentProps<typeof Description>) {
  return (
    <Description
      ref={ref}
      className={cn("text-sm text-copy-light", className)}
      {...props}
    />
  );
}

type DialogTriggerProps = ButtonProps & ComponentProps<typeof Trigger>;

function DialogTrigger({
  className,
  fill,
  outline,
  size,
  ghost,
  text,
  ...props
}: DialogTriggerProps) {
  return (
    <Button
      asChild
      outline={outline}
      size={size}
      fill={fill}
      text={text}
      ghost={ghost}
      className={className}
    >
      <Trigger {...props} />
    </Button>
  );
}

export {
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogTriggerProps,
};
