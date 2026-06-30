// Figma: tab (550:5106)
// Variants: state=Default|hover|focused|selected|disabled, has count=false|true

type TabProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  count?: number;
  onClick?: () => void;
};

export function Tab({ label, selected = false, disabled = false, count, onClick }: TabProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'relative flex flex-col items-center justify-center px-3 py-3 transition-colors outline-none',
        // Bottom border: 2px brand when selected, overlays the container's 1px separator via pb-px on the container
        selected ? 'border-b-2 border-brand-primary' : '',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={[
            'font-picky-sans text-[18px] leading-[1.4]',
            selected
              ? 'font-semibold text-neutral-primary'
              : disabled
              ? 'font-normal text-neutral-disabled'
              : 'font-normal text-neutral-tertiary hover:text-neutral-secondary',
          ].join(' ')}
        >
          {label}
        </span>

        {count !== undefined && (
          <span
            className={[
              'font-picky-sans font-semibold text-[12px] leading-[1.4] rounded-full px-1.5 py-0.5',
              selected
                ? 'bg-brand-primary text-brand-inverse'
                : 'bg-neutral-secondary text-neutral-tertiary',
            ].join(' ')}
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
