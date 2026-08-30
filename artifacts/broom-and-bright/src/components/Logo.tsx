interface LogoProps {
  /** "dark" for light backgrounds (nav), "light" for dark backgrounds (footer) */
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const ink = variant === "light" ? "#ffffff" : "#1E293B";
  const accent = variant === "light" ? "#8fc3d4" : "#3FA0C7";

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="relative">
        {/* roof, sitting on top of the wordmark */}
        <svg
          viewBox="0 0 60 22"
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 -top-3 w-12 md:w-14 h-auto"
        >
          <path
            d="M3 20 L30 3 L57 20"
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span
          className="relative block translate-y-1.5 text-[26px] md:text-[32px] leading-none tracking-tight"
          style={{ fontFamily: "'Quicksand', 'Segoe UI', sans-serif", fontWeight: 700, color: ink }}
        >
          True Clean
        </span>
      </div>
      <span
        className="text-[10px] md:text-xs mt-1.5"
        style={{
          fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
          fontWeight: 600,
          letterSpacing: "0.25em",
          color: accent,
        }}
      >
        CLEANING SERVICES
      </span>
    </div>
  );
}
