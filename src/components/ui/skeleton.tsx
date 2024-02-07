import { Card, type CardProps } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function Skeleton({ className, ...props }: CardProps) {
  return (
    <Card className={cn("motion-safe:animate-pulse", className)} {...props} />
  );
}

export type SkeletonProps = CardProps;
