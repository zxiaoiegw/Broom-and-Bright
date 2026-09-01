interface LogoProps {
  /** "dark" for light backgrounds (nav), "light" for dark backgrounds (footer) */
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const ink = variant === "light" ? "#ffffff" : "#1b1d21";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="13" cy="13" r="13" fill="#3fae74" />
        <path
          d="M13 4 L15 11 L22 13 L15 15 L13 22 L11 15 L4 13 L11 11 Z"
          fill="#fff"
        />
      </svg>
      <span
        className="text-[1.15rem] md:text-xl font-bold leading-none tracking-[-0.01em]"
        style={{
          fontFamily: "'Bricolage Grotesque', 'Segoe UI', sans-serif",
          color: ink,
        }}
      >
        True Clean
      </span>
    </span>
  );
}
