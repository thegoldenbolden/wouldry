import { forwardRef, type ComponentProps } from "react";
import { cn } from "~/lib/utils";

type TextAreaProps = ComponentProps<"textarea">;

const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "bg-transparent aria-invalid:focus-visible:outline-error focus-visible:z-10 focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
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
