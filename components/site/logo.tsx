import Image from "next/image";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Esema Properties & Homes"
    >
      {/* Roofline */}
      <path d="M4 22 L24 6 L44 22" stroke="var(--color-navy)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* House body / E-bar built from the walls */}
      <path d="M10 22 V42 H38 V22" stroke="var(--color-navy)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Green door/mark forming the "E" crossbar — the growth accent */}
      <rect x="19" y="27" width="10" height="15" rx="1.5" fill="var(--color-forest)" />
      <rect x="10.5" y="30.5" width="8" height="4" rx="1" fill="var(--color-forest)" />
    </svg>
  );
}

export function Logo({
  logoUrl,
  siteName,
  className,
  iconClassName = "h-10 w-10",
  gapClassName = "gap-2.5",
  textClassName = "text-lg",
}: {
  logoUrl?: string | null;
  siteName: string;
  className?: string;
  /** Tailwind height/width classes for the icon, e.g. "h-14 w-14" */
  iconClassName?: string;
  /** Tailwind gap class between the icon and the text label */
  gapClassName?: string;
  /** Tailwind text-size class for the label next to the icon */
  textClassName?: string;
}) {
  return (
    <span className={`flex items-center ${gapClassName} ${className ?? ""}`}>
      {logoUrl ? (
        <Image src={logoUrl} alt={siteName} width={64} height={64} className={`${iconClassName} object-contain`} />
      ) : (
        <LogoMark className={iconClassName} />
      )}
      <span className={`font-display font-bold leading-tight text-[var(--color-navy)] ${textClassName}`}>
        {siteName}
      </span>
    </span>
  );
}
