interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export function Icon({ name, size = 24, className = "", color }: IconProps) {
  return (
    <svg
      className={`icon icon-${name} ${className}`}
      width={size}
      height={size}
      aria-hidden="true"
      style={color ? { color } : undefined}
    >
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}
