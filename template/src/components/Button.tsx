"use client"

import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
  className?: string
}

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<HTMLMotionProps<"button">, "size"> & { href?: never }

type ButtonAsLinkProps = ButtonBaseProps & Omit<HTMLMotionProps<"a">, "size">

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "h-fit w-fit inline-flex items-center justify-center font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer rounded select-none"

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    outline:
      "border border-primary text-primary hover:bg-primary/10 disabled:border-gray-300 disabled:text-gray-300",
  }

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }

  if (props.href) {
    const linkProps = props as Omit<HTMLMotionProps<"a">, "size">
    return (
      <motion.a
        href={props.href}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...linkProps}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  const buttonProps = props as Omit<HTMLMotionProps<"button">, "size">
  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...buttonProps}
      type={buttonProps.type || "button"}
      {...(!buttonProps.disabled && {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      })}
    >
      {children}
    </motion.button>
  )
}
