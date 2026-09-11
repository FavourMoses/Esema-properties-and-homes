import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-deep)]",
  secondary:
    "border border-[var(--color-navy)] text-[var(--color-navy)] bg-transparent hover:bg-[var(--color-navy)] hover:text-white",
  ghost: "text-[var(--color-navy)] hover:bg-[var(--color-sage)]",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
