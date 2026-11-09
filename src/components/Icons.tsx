import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export const WhatsappIcon = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.66 15l-1.3 4.76 4.87-1.28A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.89.76.77-2.82-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.05 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.7c1.56.68 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const InstagramIcon = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.5V4.46A20 20 0 0 0 14.3 4.3c-2.2 0-3.7 1.34-3.7 3.8v2.4H8.1v3h2.5V21h2.9Z" />
  </svg>
);

export const Monogram = ({ className = "" }: { className?: string }) => (
  <span className={`monogram ${className}`} aria-hidden="true">
    RD
  </span>
);

/** Line-drawn botanical sprig used as decoration and image placeholder. */
export const Sprig = ({ size = 64, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M32 60V14" />
    <path d="M32 46c-8-1-13-6-14-13 7 0 13 5 14 13Z" />
    <path d="M32 38c8-1 13-6 14-13-7 0-13 5-14 13Z" />
    <path d="M32 28c-6-1-10-5-11-10 6 0 10 4 11 10Z" />
    <circle cx="32" cy="10" r="4" />
  </svg>
);

/** Hero illustration: pressed-flower composition (no photo needed). */
export const BotanicalArt = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Ilustração de flores, folhas e cacto" {...p}>
    <rect width="400" height="500" fill="var(--surface)" />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* stems */}
      <g stroke="var(--accent)" strokeWidth="2.2">
        <path d="M200 470C196 380 182 300 150 220" />
        <path d="M200 470C206 370 230 290 270 200" />
        <path d="M200 470c0-90 2-170 6-250" />
        <path d="M200 470C170 410 120 360 80 330" />
        <path d="M200 470c40-50 90-90 140-110" />
      </g>
      {/* leaves */}
      <g fill="var(--accent)" fillOpacity="0.16" stroke="var(--accent)" strokeWidth="1.6">
        <path d="M172 330c-30-6-48-26-52-52 28 2 48 22 52 52Z" />
        <path d="M226 310c30-8 46-30 48-56-28 4-46 26-48 56Z" />
        <path d="M118 360c-26 4-48-6-62-26 24-8 48 2 62 26Z" />
        <path d="M290 372c24 8 48 2 64-16-22-12-48-6-64 16Z" />
        <path d="M204 260c-18-14-22-36-14-58 18 12 22 34 14 58Z" />
      </g>
      {/* rose */}
      <g stroke="var(--primary)" strokeWidth="2">
        <circle cx="150" cy="200" r="34" fill="var(--primary)" fillOpacity="0.12" />
        <path d="M150 178c14 2 22 12 20 24-2 14-16 20-28 16-10-4-14-16-8-24 6-8 18-6 20 2" />
        <path d="M126 186c-6 12-4 28 8 38M174 214c-4 10-12 16-24 18" />
      </g>
      {/* daisy */}
      <g stroke="var(--foreground)" strokeWidth="1.6" fill="var(--card)">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx="270" cy="168" rx="9" ry="26" transform={`rotate(${i * 30} 270 194)`} />
        ))}
        <circle cx="270" cy="194" r="12" fill="var(--warning)" fillOpacity="0.55" />
      </g>
      {/* tulip-like bud */}
      <g stroke="var(--primary)" strokeWidth="2" fill="var(--primary)" fillOpacity="0.18">
        <path d="M206 222c-18-10-22-34-10-52 4 10 8 14 10 14 2 0 6-4 10-14 12 18 8 42-10 52Z" />
      </g>
      {/* small cactus in pot */}
      <g strokeWidth="1.8">
        <path d="M318 470h52l-6-44h-40Z" fill="var(--warning)" fillOpacity="0.25" stroke="var(--foreground)" />
        <path d="M344 426v-60c0-10 14-10 14 0v60" fill="var(--accent)" fillOpacity="0.22" stroke="var(--accent)" />
        <path d="M344 400h-10c-6 0-8-4-8-10v-12c0-8 10-8 10 0v10" stroke="var(--accent)" />
      </g>
      {/* buds */}
      <g fill="var(--primary)">
        <circle cx="80" cy="326" r="5" />
        <circle cx="340" cy="358" r="5" />
      </g>
    </g>
  </svg>
);
