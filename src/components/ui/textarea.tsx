import { forwardRef, type ComponentProps } from "react";
import { cn } from "~/lib/utils";

type TextAreaProps = ComponentProps<"textarea">;

const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "bg-transparent focus-visible:z-10 focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:outline-error",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, type TextAreaProps };
