"use client";

import { Button, type ButtonVariants } from "~/components/ui/button";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "~/lib/utils";
import React from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = ({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => {
  return <TabsPrimitive.List ref={ref} className={className} {...props} />;
};

type TabsTriggerProps = ButtonVariants &
  React.ComponentProps<typeof TabsPrimitive.Trigger>;

const TabsTrigger = ({ className, ref, ...props }: TabsTriggerProps) => {
  return (
    <Button asChild>
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "radix-state-active:text-primary radix-state-inactive:text-inherit",
          className,
        )}
        {...props}
      />
    </Button>
  );
};

const TabsContent = ({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
