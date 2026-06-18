import Image from "next/image";

type SeazoneIconProps = {
  size?: number;
  className?: string;
  white?: boolean;
};

export function SeazoneIcon({ size = 20, className, white = false }: SeazoneIconProps) {
  return (
    <Image
      src="/seazone-logo.png"
      alt="Seazone"
      width={size}
      height={size}
      className={className}
      style={white ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
