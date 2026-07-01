// Figma: Tag button (662:23445)
// States: Default | hover | focused | selected | disabled

type TagButtonProps = {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export function TagButton({ selected = false, disabled = false, onClick, children }: TagButtonProps) {
  let cls: string;

  if (disabled) {
    cls = 'bg-neutral-disabled text-neutral-disabled cursor-not-allowed';
  } else if (selected) {
    cls = 'bg-brand-primary text-neutral-inverse cursor-pointer';
  } else {
    cls =
      'bg-neutral-tertiary text-neutral-primary cursor-pointer ' +
      'hover:bg-brand-quinary hover:text-brand-primary ' +
      'focus-visible:bg-brand-quinary focus-visible:text-brand-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary';
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center px-3 py-1.5',
        'rounded-full border border-transparent',
        'font-picky-sans font-normal text-[12px] leading-[1.4] tracking-[0.24px]',
        'whitespace-nowrap transition-colors',
        cls,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
