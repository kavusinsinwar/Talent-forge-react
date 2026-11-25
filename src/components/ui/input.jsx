import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[14px] text-[var(--color-text)] file:border-0 file:bg-transparent file:text-[13px] file:font-medium placeholder:text-[var(--color-text-subtle)] focus-visible:outline-none focus-visible:border-[var(--color-primary)] focus-visible:ring-3 focus-visible:ring-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
