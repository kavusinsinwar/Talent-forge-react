/* eslint-disable react/prop-types */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] text-[13px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-[0.98] shadow-xs",
        primary:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-[0.98] shadow-xs",
        secondary:
          "border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary-soft)] active:scale-[0.98]",
        outline:
          "border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-text-muted)]",
        ghost:
          "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]",
        danger:
          "bg-[var(--color-danger)] text-white hover:opacity-90 shadow-xs",
        destructive:
          "bg-[var(--color-danger)] text-white hover:opacity-90 shadow-xs",
        link:
          "text-[var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto font-normal",
        blue:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
      },
      size: {
        default: "h-9 px-4 py-2", // 36px
        sm: "h-7 px-3 text-xs", // 28px
        md: "h-9 px-4 text-[13px]", // 36px
        lg: "h-11 px-6 text-sm", // 44px
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
