import React, { useId } from 'react';

export type FounderWatermarkVariant =
  | 'subtle-watermark'   // 3%–5% opacity full-page or section backdrop
  | 'section-banner'      // Subtle watermark inside hero or section cards
  | 'signature-seal'      // High-fidelity presentation seal for About modal / dialogs
  | 'footer-badge';       // Elegant understated credit badge

interface FounderWatermarkProps {
  variant?: FounderWatermarkVariant;
  className?: string;
  opacity?: number; // Override opacity if needed
  ariaHidden?: boolean;
}

export const FounderWatermark: React.FC<FounderWatermarkProps> = ({
  variant = 'subtle-watermark',
  className = '',
  opacity,
  ariaHidden = true,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const gradId = `founderBotanicalGrad_${uniqueId}`;
  const leafGradId = `leafGrad_${uniqueId}`;
  const darkGradId = `darkBotanicalGrad_${uniqueId}`;

  // Tailored SVG dimensions and layout for the calligraphy piece
  // ViewBox: 800 x 300 allows expansive horizontal botanical vines and calligraphy text
  const svgContent = (
    <svg
      viewBox="0 0 860 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto transition-colors duration-300"
      role={ariaHidden ? 'presentation' : 'img'}
      aria-label={ariaHidden ? undefined : 'Artistic Founder Signature: Idris & Melody'}
    >
      <defs>
        {/* Light theme forest-green & emerald gradient */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="35%" stopColor="#047857" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        {/* Dark theme luminous emerald & mint gradient */}
        <linearGradient id={darkGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="40%" stopColor="#10b981" />
          <stop offset="75%" stopColor="#059669" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>

        {/* Leaf fill gradient */}
        <linearGradient id={leafGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
        </linearGradient>

        {/* Subtle shadow filter for seal mode */}
        {variant === 'signature-seal' && (
          <filter id={`sealGlow_${uniqueId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#047857" floodOpacity="0.18" />
          </filter>
        )}
      </defs>

      {/* Decorative Botanical Flourishes: Upper Vine Network */}
      <g className="stroke-emerald-800 dark:stroke-emerald-400" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Left crowning arch vine */}
        <path
          d="M 120 115 C 160 70, 240 50, 320 62 C 370 70, 400 95, 415 110"
          fill="none"
        />
        {/* Left top tendril spiral */}
        <path
          d="M 120 115 C 105 125, 95 110, 102 98 C 110 85, 130 88, 135 96"
          fill="none"
          strokeWidth="1.2"
        />

        {/* Right crowning arch vine */}
        <path
          d="M 445 110 C 460 95, 490 70, 540 62 C 620 50, 700 70, 740 115"
          fill="none"
        />
        {/* Right top tendril spiral */}
        <path
          d="M 740 115 C 755 125, 765 110, 758 98 C 750 85, 730 88, 725 96"
          fill="none"
          strokeWidth="1.2"
        />
      </g>

      {/* Botanical Foliage & Leaves along upper arches */}
      <g className="fill-emerald-800/80 dark:fill-emerald-400/80 stroke-emerald-900/40 dark:stroke-emerald-300/40" strokeWidth="0.8">
        {/* Left foliage cluster */}
        <path d="M 175 75 C 168 62, 178 50, 192 56 C 200 62, 192 78, 175 75 Z" />
        <path d="M 225 60 C 220 45, 235 38, 246 45 C 252 52, 242 66, 225 60 Z" />
        <path d="M 275 56 C 275 40, 292 38, 298 48 C 302 58, 288 65, 275 56 Z" />
        <path d="M 335 64 C 340 50, 356 52, 358 64 C 358 74, 344 76, 335 64 Z" />
        <path d="M 380 82 C 390 70, 404 76, 403 88 C 400 97, 388 95, 380 82 Z" />

        {/* Right foliage cluster */}
        <path d="M 480 82 C 470 70, 456 76, 457 88 C 460 97, 472 95, 480 82 Z" />
        <path d="M 525 64 C 520 50, 504 52, 502 64 C 502 74, 516 76, 525 64 Z" />
        <path d="M 585 56 C 585 40, 568 38, 562 48 C 558 58, 572 65, 585 56 Z" />
        <path d="M 635 60 C 640 45, 625 38, 614 45 C 608 52, 618 66, 635 60 Z" />
        <path d="M 685 75 C 692 62, 682 50, 668 56 C 660 62, 668 78, 685 75 Z" />
      </g>

      {/* Central Botanical Ampersand & Sprout Ligature */}
      <g className="stroke-emerald-800 dark:stroke-emerald-300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Ampersand stem intertwining tendrils */}
        <path
          d="M 430 135 C 418 120, 412 100, 430 92 C 448 85, 452 105, 438 122 C 420 144, 408 168, 428 178 C 445 186, 460 172, 462 155"
          fill="none"
          strokeWidth="2.2"
        />
        {/* Ampersand leaf flourish */}
        <path
          d="M 458 152 C 472 142, 480 152, 474 165 C 468 172, 455 166, 458 152 Z"
          className="fill-emerald-700/80 dark:fill-emerald-400/80"
          strokeWidth="0.8"
        />
        <path
          d="M 432 90 C 426 78, 438 70, 446 76 C 452 82, 444 94, 432 90 Z"
          className="fill-emerald-700/80 dark:fill-emerald-400/80"
          strokeWidth="0.8"
        />
      </g>

      {/* Main Calligraphy Typography: IDRIS & MELODY */}
      <g
        className="font-serif select-none"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          letterSpacing: '0.18em',
        }}
      >
        {/* "IDRIS" Typography */}
        <text
          x="260"
          y="165"
          textAnchor="middle"
          className="text-[64px] font-medium fill-emerald-950 dark:fill-emerald-300 transition-colors"
          style={{ fontStyle: 'italic', fontVariant: 'small-caps' }}
        >
          IDRIS
        </text>

        {/* Botanical "&" */}
        <text
          x="430"
          y="163"
          textAnchor="middle"
          className="text-[44px] font-normal fill-emerald-800 dark:fill-emerald-400"
          style={{ fontStyle: 'italic' }}
        >
          &amp;
        </text>

        {/* "MELODY" Typography */}
        <text
          x="600"
          y="165"
          textAnchor="middle"
          className="text-[64px] font-medium fill-emerald-950 dark:fill-emerald-300 transition-colors"
          style={{ fontStyle: 'italic', fontVariant: 'small-caps' }}
        >
          MELODY
        </text>
      </g>

      {/* Sub-label kicker: FOUNDERS & ARCHITECTS */}
      <g
        className="select-none"
        style={{
          fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
          letterSpacing: '0.34em',
        }}
      >
        <text
          x="430"
          y="204"
          textAnchor="middle"
          className="text-[11px] font-semibold uppercase fill-emerald-800/80 dark:fill-emerald-400/80"
        >
          Founders’ Botanical Signature
        </text>
      </g>

      {/* Lower Sweeping Calligraphy Flourish with Rwandan Coffee / Tea Leaf Garland */}
      <g className="stroke-emerald-800 dark:stroke-emerald-400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Main sweeping base flourish curve */}
        <path
          d="M 90 220 C 200 242, 340 248, 430 248 C 520 248, 660 242, 770 220"
          fill="none"
        />

        {/* Lower accent loop left */}
        <path
          d="M 180 232 C 140 244, 110 260, 130 274 C 150 285, 190 270, 230 245"
          fill="none"
          strokeWidth="1.3"
        />

        {/* Lower accent loop right */}
        <path
          d="M 680 232 C 720 244, 750 260, 730 274 C 710 285, 670 270, 630 245"
          fill="none"
          strokeWidth="1.3"
        />

        {/* Delicate vine roots & tendrils */}
        <path
          d="M 430 248 C 430 265, 420 280, 405 288 C 395 292, 385 286, 390 276 C 396 265, 415 264, 424 250"
          fill="none"
          strokeWidth="1.2"
        />
        <path
          d="M 430 248 C 430 265, 440 280, 455 288 C 465 292, 475 286, 470 276 C 464 265, 445 264, 436 250"
          fill="none"
          strokeWidth="1.2"
        />
      </g>

      {/* Lower Leaf Clusters along base ribbon */}
      <g className="fill-emerald-800/80 dark:fill-emerald-400/80 stroke-emerald-900/40 dark:stroke-emerald-300/40" strokeWidth="0.7">
        <path d="M 260 240 C 255 252, 268 262, 280 256 C 286 248, 276 236, 260 240 Z" />
        <path d="M 320 244 C 316 258, 332 266, 344 258 C 348 248, 336 240, 320 244 Z" />
        <path d="M 370 246 C 368 260, 384 268, 395 260 C 398 250, 386 244, 370 246 Z" />

        {/* Center budding sprout */}
        <path d="M 426 248 C 418 258, 422 268, 430 266 C 438 268, 442 258, 434 248 Z" />

        <path d="M 490 246 C 492 260, 476 268, 465 260 C 462 250, 474 244, 490 246 Z" />
        <path d="M 540 244 C 544 258, 528 266, 516 258 C 512 248, 524 240, 540 244 Z" />
        <path d="M 600 240 C 605 252, 592 262, 580 256 C 574 248, 584 236, 600 240 Z" />
      </g>

      {/* Outer botanical framed crest (ornamental corners for seal mode) */}
      {variant === 'signature-seal' && (
        <g className="stroke-emerald-700/60 dark:stroke-emerald-400/60" strokeWidth="1">
          {/* Top-left ornamental corner */}
          <path d="M 50 70 C 50 40, 70 30, 100 30" fill="none" />
          <circle cx="50" cy="70" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />
          <circle cx="100" cy="30" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />

          {/* Top-right ornamental corner */}
          <path d="M 810 70 C 810 40, 790 30, 760 30" fill="none" />
          <circle cx="810" cy="70" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />
          <circle cx="760" cy="30" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />

          {/* Bottom-left ornamental corner */}
          <path d="M 50 250 C 50 280, 70 290, 100 290" fill="none" />
          <circle cx="50" cy="250" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />
          <circle cx="100" cy="290" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />

          {/* Bottom-right ornamental corner */}
          <path d="M 810 250 C 810 280, 790 290, 760 290" fill="none" />
          <circle cx="810" cy="250" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />
          <circle cx="760" cy="290" r="2.5" className="fill-emerald-700 dark:fill-emerald-400" />
        </g>
      )}
    </svg>
  );

  // Variant 1: Subtle Full-Viewport Background Watermark (3–5% Opacity)
  if (variant === 'subtle-watermark') {
    return (
      <div
        className={`pointer-events-none select-none fixed inset-0 flex items-center justify-center overflow-hidden z-0 ${className}`}
        aria-hidden="true"
        style={{
          opacity: opacity !== undefined ? opacity : undefined,
        }}
      >
        <div className="w-[850px] max-w-[92vw] transform -rotate-6 scale-95 sm:scale-105 lg:scale-115 opacity-[0.038] dark:opacity-[0.048] transition-opacity">
          {svgContent}
        </div>
      </div>
    );
  }

  // Variant 2: Section / Card Banner Watermark (Embedded subtly in header / hero cards)
  if (variant === 'section-banner') {
    return (
      <div
        className={`pointer-events-none select-none absolute right-[-40px] sm:right-0 top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] z-0 overflow-hidden ${className}`}
        aria-hidden="true"
        style={{
          opacity: opacity !== undefined ? opacity : undefined,
        }}
      >
        <div className="transform rotate-2 opacity-[0.045] dark:opacity-[0.065] transition-opacity">
          {svgContent}
        </div>
      </div>
    );
  }

  // Variant 3: Footer Inline Mini Emblem / Signature
  if (variant === 'footer-badge') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className="w-24 sm:w-28 opacity-80 dark:opacity-90 hover:opacity-100 transition-opacity">
          {svgContent}
        </div>
      </div>
    );
  }

  // Variant 4: High-Fidelity Signature Seal (For About Founders Modal / Dedicated Information)
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-emerald-50/70 via-stone-50/50 to-emerald-50/30 dark:from-emerald-950/20 dark:via-stone-900/40 dark:to-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs ${className}`}
    >
      <div className="max-w-xl mx-auto">
        {svgContent}
      </div>
    </div>
  );
};
