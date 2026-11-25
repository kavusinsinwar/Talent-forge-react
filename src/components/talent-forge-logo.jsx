import React from "react";
import { Compass } from "lucide-react";

export function TalentForgeLogo({ className = "", size = "default" }) {
  const isSmall = size === "small";

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-[var(--color-primary)] text-white shadow-xs flex-shrink-0 transition-transform hover:scale-105">
        <Compass className="w-4 h-4 stroke-[2.2]" />
      </div>

      {/* Brand Wordmark */}
      <div className="flex items-center tracking-tight font-bold">
        <span className={`text-[var(--color-text)] font-extrabold ${isSmall ? "text-lg" : "text-xl"}`}>
          Talent<span className="text-[var(--color-primary)]">Forge</span>
        </span>
      </div>
    </div>
  );
}

export default TalentForgeLogo;
