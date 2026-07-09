// Figma: tab (550:5106)
// Variants: state=Default|hover|focused|selected|disabled, has count=false|true
// selectionCount: shows inline "(N)" when a tab's content has N items selected (onboarding allergies/dislikes)

type TabProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  count?: number;
  selectionCount?: number;
  onClick?: () => void;
};

export function Tab({ label, selected = false, disabled = false, count, selectionCount, onClick }: TabProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'relative flex items-center justify-center shrink-0 px-3 py-3 transition-colors outline-none whitespace-nowrap',
        selected ? 'border-b-2 border-brand-primary' : '',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex items-center gap-1">
        <span
          className={[
            'font-picky-sans text-[18px] leading-[1.5]',
            selected
              ? 'font-semibold text-neutral-primary'
              : disabled
              ? 'font-normal text-neutral-disabled'
              : 'font-normal text-neutral-tertiary hover:text-neutral-secondary',
          ].join(' ')}
        >
          {label}
        </span>

        {/* Badge count — used in grocery store tabs */}
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

        {/* Inline selection count — "(N)" style, used in onboarding per-member tabs */}
        {selectionCount !== undefined && selectionCount > 0 && (
          <span
            className={[
              'font-picky-sans font-semibold text-[12px] leading-[1.4] tracking-[0.24px]',
              selected ? 'text-neutral-primary' : 'text-neutral-tertiary',
            ].join(' ')}
          >
            ({selectionCount})
          </span>
        )}
      </div>
    </button>
  );
}
