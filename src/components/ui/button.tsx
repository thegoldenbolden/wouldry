import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const buttonVariants = cva(
  "z-10 flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium text-foreground outline-transparent focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed aria-disabled:cursor-not-allowed motion-safe:transition-all",
  {
    variants: {
      fill: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/80",
        foreground: "bg-foreground text-background hover:bg-foreground/80",
        border: "bg-border text-border-foreground hover:bg-border/80",
        danger: "bg-error text-error-foreground hover:bg-error/80",
        success: "bg-success text-success-foreground hover:bg-success/80",
        warning: "bg-warning text-warning-foreground hover:bg-warning/80",
      },
      outline: {
        primary:
          "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        foreground:
          "border border-foreground hover:bg-foreground hover:text-background",
        border:
          "border border-border hover:bg-border hover:text-border-foreground",
        danger:
          "border border-error text-error hover:bg-error hover:text-error-foreground",
        success:
          "border border-success text-success hover:bg-success hover:text-success-foreground",
        warning:
          "border border-warning text-warning hover:bg-warning hover:text-warning-foreground",
      },
      ghost: {
        primary: "hover:bg-primary hover:text-primary-foreground",
        foreground: "hover:bg-foreground hover:text-background",
        border: "hover:bg-border hover:text-border-foreground",
        danger: "hover:bg-error hover:text-error-foreground",
        warning: "hover:bg-warning hover:text-warning-foreground",
        success: "hover:bg-success hover:text-success-foreground",
      },
      text: {
        primary: "text-primary decoration-2 hover:underline",
        foreground: "text-foreground decoration-2 hover:underline",
        border: "text-border decoration-2 hover:underline",
        danger: "text-error decoration-2 hover:underline",
        success: "text-success decoration-2 hover:underline",
        warning: "text-warning decoration-2 hover:underline",
      },
      size: {
        sm: "p-1",
        md: "px-4 py-2",
        lg: "px-6 py-4",
        icon: "size-10 p-1.5 *:has-[svg]:size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = ButtonVariants &
  React.ComponentPropsWithRef<"button"> & {
    asChild?: boolean;
  };

export function Button({
  className,
  fill,
  outline,
  ghost,
  size,
  text,
  asChild,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        buttonVariants({ fill, text, ghost, outline, size }),
        className,
      )}
      {...props}
    />
  );
}
