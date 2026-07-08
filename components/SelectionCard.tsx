type SelectionCardProps = {
  label: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
};

export function SelectionCard({ label, subtitle, selected, onClick }: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left px-4 py-3.5 rounded-[12px] border transition-colors cursor-pointer outline-none',
        selected
          ? 'border-2 border-brand-primary bg-neutral-primary'
          : 'border border-neutral-primary bg-neutral-primary',
      ].join(' ')}
    >
      <span
        className={[
          'font-picky-sans text-[15px] leading-[1.5] block',
          selected ? 'font-semibold text-brand-primary' : 'font-normal text-neutral-primary',
        ].join(' ')}
      >
        {label}
      </span>
      {subtitle && (
        <span className="font-picky-sans font-normal text-[13px] leading-[1.4] text-neutral-tertiary block mt-0.5">
          {subtitle}
        </span>
      )}
    </button>
  );
}
