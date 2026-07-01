type AvatarColor = 'purple' | 'blue' | 'orange' | 'green';
type AvatarSize = 48 | 24 | 16;
type AvatarType = 'subtle' | 'bold';

type AvatarProps = {
  initials: string;
  color?: AvatarColor;
  size?: AvatarSize;
  type?: AvatarType;
  bordered?: boolean;
  className?: string;
};

const colorMap: Record<AvatarColor, { bg: string; text: string }> = {
  purple: { bg: 'bg-purple-10', text: 'text-purple-80' },
  blue:   { bg: 'bg-blue-10',   text: 'text-blue-80' },
  orange: { bg: 'bg-orange-10', text: 'text-orange-70' },
  green:  { bg: 'bg-green-10',  text: 'text-green-80' },
};

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  48: { container: 'size-12',   text: 'text-2xl' },
  24: { container: 'size-6',    text: 'text-xs' },
  16: { container: 'size-4',    text: 'text-[10px]' },
};

export function Avatar({
  initials,
  color = 'purple',
  size = 48,
  bordered = false,
  className,
}: AvatarProps) {
  const { bg, text } = colorMap[color];
  const { container, text: textSize } = sizeMap[size];
  const border = bordered ? 'border-2 border-brand-primary shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)]' : '';

  return (
    <div className={`flex items-center justify-center rounded-full overflow-clip shrink-0 ${container} ${bg} ${border} ${className ?? ''}`}>
      <span className={`font-picky-hand font-semibold leading-[1.2] whitespace-nowrap ${textSize} ${text}`}>
        {initials}
      </span>
    </div>
  );
}
