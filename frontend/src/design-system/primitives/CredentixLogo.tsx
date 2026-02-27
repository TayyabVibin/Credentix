/**
 * Credentix brand mark — credit card motif with emerald accent
 */

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export default function CredentixLogo({ size = 32, color = 'currentColor', className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="2"
        y="6"
        width="28"
        height="20"
        rx="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="6"
        y="12"
        width="8"
        height="6"
        rx="1"
        fill={color}
        fillOpacity="0.9"
      />
      <path
        d="M18 14h10M18 17h8M18 20h6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
