type SeazoneIconProps = {
  size?: number;
  className?: string;
};

export function SeazoneIcon({ size = 20, className }: SeazoneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* chimney */}
      <rect x="62" y="10" width="13" height="22" rx="3" />
      {/* roof */}
      <path d="M50 8 L92 42 Q94 44 92 46 L86 46 L86 90 Q86 94 82 94 L18 94 Q14 94 14 90 L14 46 L8 46 Q6 44 8 42 Z" />
      {/* circular hole */}
      <circle cx="50" cy="66" r="21" fill="white" />
    </svg>
  );
}
