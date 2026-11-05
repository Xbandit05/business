import React from 'react';

interface AgriBridgeBrandIconProps {
  className?: string;
  size?: number;
  variant?: 'standalone' | 'badge';
}

/**
 * AgriBridge Rwanda - Standalone Bridge Brand Icon
 * 
 * Replaces the old leaf-only icon with the definitive architectural bridge emblem,
 * symbolizing the vital market infrastructure connecting Rwanda's smallholder farmers
 * to regional and national agricultural buyers ("Growing Together. Connecting Markets.").
 * 
 * Scaled and optimized for crystal-clear visibility from 16px up to 512px+.
 */
export const AgriBridgeBrandIcon: React.FC<AgriBridgeBrandIconProps> = ({
  className = 'w-5 h-5',
  size,
  variant = 'standalone',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'badge') {
    return (
      <div
        style={style}
        className={`rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-2 flex items-center justify-center shadow-xs shrink-0 ${className}`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-emerald-300"
          preserveAspectRatio="xMidYMid meet"
          aria-label="AgriBridge Rwanda Bridge Brand Icon"
        >
          {/* Main Suspension Arch Cable */}
          <path
            d="M3 20 C6 13, 9 7, 11 7 C13 7, 14 14, 16 14 C18 14, 19 7, 21 7 C23 7, 26 13, 29 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Left Tower */}
          <line x1="11" y1="6" x2="11" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="11" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Tower */}
          <line x1="21" y1="6" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="19" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

          {/* Suspender Cables */}
          <line x1="7" y1="15" x2="7" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="13.5" y1="13" x2="13.5" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="16" y1="14" x2="16" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="18.5" y1="13" x2="18.5" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="25" y1="15" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

          {/* Solid Horizontal Bridge Deck (Roadway) */}
          <rect x="2.5" y="19.5" width="27" height="2.2" rx="1.1" fill="currentColor" />

          {/* Foundation Abutment Piers */}
          <rect x="4" y="21.7" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
          <rect x="10" y="21.7" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
          <rect x="20" y="21.7" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
          <rect x="25" y="21.7" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.9" />

          {/* Supporting River/Valley Arch */}
          <path
            d="M5 25.5 C10 19.5, 22 19.5, 27 25.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* River Water Ripple */}
          <path
            d="M9 27.5 C12 26.5, 14 28, 16 27 C18 26, 20 28, 23 27"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  return (
    <svg
      style={style}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label="AgriBridge Rwanda Bridge Brand Icon"
    >
      {/* Main Suspension Arch Cable */}
      <path
        d="M3 20 C6 13, 9 7, 11 7 C13 7, 14 14, 16 14 C18 14, 19 7, 21 7 C23 7, 26 13, 29 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Left Tower */}
      <line x1="11" y1="6" x2="11" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

      {/* Right Tower */}
      <line x1="21" y1="6" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

      {/* Suspender Cables */}
      <line x1="7" y1="15" x2="7" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="13.5" y1="13" x2="13.5" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="16" y1="14" x2="16" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="18.5" y1="13" x2="18.5" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="25" y1="15" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

      {/* Solid Horizontal Bridge Deck (Roadway) */}
      <rect x="2.5" y="19.5" width="27" height="2.2" rx="1.1" fill="currentColor" />

      {/* Foundation Abutment Piers */}
      <rect x="4" y="21.7" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="10" y="21.7" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="20" y="21.7" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="25" y="21.7" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.9" />

      {/* Supporting River/Valley Arch */}
      <path
        d="M5 25.5 C10 19.5, 22 19.5, 27 25.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* River Water Ripple */}
      <path
        d="M9 27.5 C12 26.5, 14 28, 16 27 C18 26, 20 28, 23 27"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};
