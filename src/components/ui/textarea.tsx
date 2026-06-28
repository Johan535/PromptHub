import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[140px] w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
