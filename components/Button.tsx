type ButtonVariant = 'primary' | 'secondary' | 'over-image' | 'no-bg';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  selected?: boolean;
  disabled?: boolean;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

/* Button states from Figma 133:1367-1373:
 *  Primary  Default   → bg-brand-primary, text-brand-inverse
 *  Primary  Hover     → bg-brand-quarternary (darker)
 *  Primary  Focused   → bg-brand-secondary (#eda9ff), border-2 brand, text-brand-primary
 *  Primary  Disabled  → bg-neutral-disabled, text-neutral-disabled
 *  Secondary Default  → bg-neutral-primary (white), border brand, text-brand-primary
 *  Secondary Hover    → bg-neutral-secondary (#f4f2f5)
 *  Secondary Focused  → bg-neutral-secondary, border-2 brand
 *  Secondary Selected → bg-brand-secondary (#eda9ff), border brand
 *  Secondary Disabled → bg-neutral-disabled, text-neutral-disabled
 *  Size=lg (Figma Large) → py-3 px-5 text-[18px] — used for primary CTAs like "Add to this Week"
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  pill = true,
  selected = false,
  disabled = false,
  iconRight,
  iconLeft,
  onClick,
  className,
  children,
}: ButtonProps) {
  const radius = pill ? 'rounded-full' : 'rounded-[8px]';
  const px = size === 'sm' ? 'px-4' : 'px-5';
  const py = size === 'lg' ? 'py-3' : 'py-2';
  const textCls =
    size === 'sm'
      ? 'text-[12px] leading-[1.4] tracking-[0.24px]'
      : size === 'lg'
      ? 'text-[18px] leading-[1.4]'
      : 'text-[14px] leading-[1.5]';
  const gap = size === 'sm' ? 'gap-1' : 'gap-2';

  let stateClasses: string;

  if (disabled) {
    stateClasses =
      variant === 'primary'
        ? 'bg-neutral-disabled text-neutral-disabled cursor-not-allowed'
        : 'bg-neutral-disabled border border-neutral-primary text-neutral-disabled cursor-not-allowed';
  } else if (selected && variant === 'secondary') {
    stateClasses = 'bg-brand-secondary border border-brand-primary text-brand-primary';
  } else if (variant === 'primary') {
    stateClasses =
      'bg-brand-primary text-brand-inverse cursor-pointer ' +
      'hover:bg-brand-secondary hover:text-brand-primary ' +
      'focus-visible:bg-brand-secondary focus-visible:border-2 focus-visible:border-brand-primary focus-visible:text-brand-primary ' +
      'active:bg-brand-quarternary';
  } else if (variant === 'over-image') {
    stateClasses =
      'bg-overlay-inverse-primary border border-brand-inverse text-neutral-inverse cursor-pointer ' +
      'hover:bg-overlay-inverse-secondary hover:text-brand-inverse-secondary ' +
      'focus-visible:bg-overlay-inverse-secondary focus-visible:border-2 focus-visible:border-brand-inverse focus-visible:text-brand-inverse-secondary ' +
      'active:bg-overlay-inverse-primary';
  } else if (variant === 'no-bg') {
    stateClasses =
      'text-brand-primary cursor-pointer ' +
      'hover:text-brand-secondary ' +
      'focus-visible:text-brand-secondary ' +
      'active:text-brand-quarternary';
  } else {
    stateClasses =
      'bg-neutral-primary border border-brand-primary text-brand-primary cursor-pointer ' +
      'hover:bg-neutral-secondary ' +
      'focus-visible:bg-neutral-secondary focus-visible:border-2 focus-visible:border-brand-primary ' +
      'active:bg-neutral-secondary';
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'flex items-center justify-center outline-none transition-colors',
        radius,
        px,
        py,
        gap,
        textCls,
        'font-picky-sans font-semibold whitespace-nowrap',
        stateClasses,
        className ?? '',
      ].join(' ')}
    >
      {iconLeft}
      {children && <span>{children}</span>}
      {iconRight}
    </button>
  );
}
