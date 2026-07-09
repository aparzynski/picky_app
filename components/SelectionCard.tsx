type SelectionCardProps = {
  label: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
};

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="10" cy="10" r="10" fill="#7c019d" />
      <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SelectionCard({ label, subtitle, selected, onClick }: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center justify-between px-6 py-3 rounded-[16px] transition-colors cursor-pointer outline-none',
        selected
          ? 'border-2 border-brand-primary bg-brand-tertiary'
          : 'border border-neutral-primary bg-neutral-primary',
      ].join(' ')}
    >
      <div className="text-left">
        <span
          className={[
            'font-picky-sans leading-[1.5] block',
            selected
              ? 'font-semibold text-[16px] text-brand-primary'
              : 'font-normal text-[14px] text-neutral-primary',
          ].join(' ')}
        >
          {label}
        </span>
        {subtitle && (
          <span
            className={[
              'font-picky-sans font-normal text-[12px] leading-[1.4] block',
              selected ? 'text-brand-primary' : 'text-neutral-tertiary',
            ].join(' ')}
          >
            {subtitle}
          </span>
        )}
      </div>
      {selected && <CheckIcon />}
    </button>
  );
}
