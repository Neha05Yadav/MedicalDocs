import { useId } from "react";

type MediDocMarkProps = {
  className?: string;
  title?: string;
};

export function MediDocMark({ className, title }: MediDocMarkProps) {
  const instanceId = useId().replaceAll(":", "");
  const wingGradientId = `medidoc-wing-${instanceId}`;
  const bodyGradientId = `medidoc-body-${instanceId}`;
  const glowId = `medidoc-human-glow-${instanceId}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={`url(#${glowId})`}>
        <circle cx="32" cy="10.5" r="6.5" fill={`url(#${bodyGradientId})`} />

        <path
          d="M29.8 51.8C27.2 40.1 20.2 29.4 8.2 24.2C8.8 37.7 16.5 48.3 29.8 55.3"
          stroke={`url(#${wingGradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.2 51.8C36.8 40.1 43.8 29.4 55.8 24.2C55.2 37.7 47.5 48.3 34.2 55.3"
          stroke={`url(#${wingGradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M20 22.5C25.2 25.1 29.3 29.1 32 34.7C34.7 29.1 38.8 25.1 44 22.5"
          stroke={`url(#${bodyGradientId})`}
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 34.5V55"
          stroke={`url(#${bodyGradientId})`}
          strokeWidth="5.2"
          strokeLinecap="round"
        />
      </g>

      <defs>
        <linearGradient id={wingGradientId} x1="8" y1="24" x2="56" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#51d8d0" />
          <stop offset=".48" stopColor="#10b8c2" />
          <stop offset="1" stopColor="#078da5" />
        </linearGradient>
        <linearGradient id={bodyGradientId} x1="22" y1="8" x2="42" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5de2d5" />
          <stop offset=".55" stopColor="#19bdc5" />
          <stop offset="1" stopColor="#087f9c" />
        </linearGradient>
        <filter id={glowId} x="1" y="1" width="62" height="62" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.15" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
