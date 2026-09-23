import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-white text-black hover:bg-white/90",
          variant === "outline" &&
            "border border-white/20 bg-transparent text-white hover:bg-white/10",
          variant === "ghost" &&
            "bg-transparent text-white hover:bg-white/10",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };