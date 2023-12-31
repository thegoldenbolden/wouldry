import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center rounded-sm justify-center outline-transparent focus-visible:outline-offset-2 focus-visible:outline focus-visible:outline-copy focus-visible:z-10 disabled:pointer-events-none disabled:opacity-50 motion-safe:transition-all",
  {
    variants: {
      fill: {
        primary:
          "bg-primary text-primary-content hover:bg-primary/80 pressed:bg-primary/50",
        copy: "bg-copy text-foreground hover:bg-copy/80 pressed:bg-copy/50",
        danger:
          "bg-danger text-danger-content hover:bg-danger/80 pressed:bg-danger/50",
      },
      text: {
        primary:
          "text-primary underline-offset-1 hover:underline pressed:underline",
        copy: "text-copy-lighter hover:text-copy underline-offset-1 hover:underline pressed:underline",
      },
      ghost: {
        primary: "hover:bg-primary pressed:bg-primary",
        copy: "hover:bg-copy-light/10 pressed:bg-foreground/5",
      },
      outline: {
        copy: "border border-border text-inherit hover:bg-copy-light/10 pressed:bg-foreground/5",
      },
      size: {
        sm: "py-2 px-4",
      },
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, fill, text, outline, ghost, size, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ fill, text, outline, ghost, size, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
export { Button, buttonVariants, type ButtonProps, type ButtonVariants };
