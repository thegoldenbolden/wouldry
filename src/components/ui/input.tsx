import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

type InputProps = ComponentProps<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "bg-transparent w-full aria-invalid:focus-visible:outline-error focus-visible:z-10 focus-visible:outline focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, type InputProps };
