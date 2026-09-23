"use client";

import * as React from "react";
import { cn } from "./lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          "disabled:pointer-events-none disabled:opacity-50",

          variant === "default" &&
            "bg-black text-white hover:bg-neutral-800",

          variant === "secondary" &&
            "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",

          variant === "outline" &&
            "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100",

          variant === "ghost" &&
            "text-neutral-700 hover:bg-neutral-100",

          size === "sm" && "h-8 px-3 text-sm",
          size === "default" && "h-10 px-4",
          size === "lg" && "h-12 px-6 text-base",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };