"use client";

import type { AlertDialogPortalProps } from "@radix-ui/react-alert-dialog";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { Button, type ButtonProps } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const AlertDialog = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.Root),
);
const Trigger = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogTrigger),
);
const Cancel = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogCancel),
);
const Action = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogAction),
);
const Portal = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogPortal),
);
const Overlay = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogOverlay),
);
const Content = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogContent),
);
const Title = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then((mod) => mod.AlertDialogTitle),
);
const Description = dynamic(() =>
  import("@radix-ui/react-alert-dialog").then(
    (mod) => mod.AlertDialogDescription,
  ),
);

function AlertDialogPortal(props: AlertDialogPortalProps) {
  return <Portal {...props} />;
}

function AlertDialogOverlay({
  className,
  ref,
  ...props
}: ComponentProps<typeof Overlay>) {
  return (
    <Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 radix-state-closed:animate-out radix-state-closed:fade-out-0 radix-state-open:animate-in radix-state-open:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ref,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-svh w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-auto border border-solid border-border bg-background p-6 duration-200 radix-state-closed:animate-out radix-state-closed:fade-out-0 radix-state-closed:zoom-out-95 radix-state-closed:slide-out-to-left-1/2 radix-state-closed:slide-out-to-top-[48%]  radix-state-open:animate-in radix-state-open:fade-in-0 radix-state-open:zoom-in-95 radix-state-open:slide-in-from-left-1/2 radix-state-open:slide-in-from-top-[48%] md:max-w-sm",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogTitle({
  className,
  ref,
  ...props
}: ComponentProps<typeof Title>) {
  return (
    <Title
      ref={ref}
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ref,
  ...props
}: ComponentProps<typeof Description>) {
  return (
    <Description
      ref={ref}
      className={cn("text-inherit", className)}
      {...props}
    />
  );
}

type AlertDialogActionProps = ButtonProps & ComponentProps<typeof Action>;
function AlertDialogAction({
  className,
  fill,
  outline,
  size,
  ghost,
  text,
  ref,
  ...props
}: AlertDialogActionProps) {
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
      <Action {...props} />
    </Button>
  );
}

type AlertDialogTriggerProps = ButtonProps & ComponentProps<typeof Trigger>;
function AlertDialogTrigger({
  className,
  fill,
  outline,
  size,
  ghost,
  text,
  ...props
}: AlertDialogTriggerProps) {
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

type AlertDialogCancelProps = ButtonProps & ComponentProps<typeof Cancel>;
function AlertDialogCancel({
  className,
  fill,
  outline,
  size,
  ghost,
  text,
  ref,
  ...props
}: AlertDialogCancelProps) {
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
      <Cancel {...props} />
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
};
