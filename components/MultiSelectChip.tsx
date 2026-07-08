type MultiSelectChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function MultiSelectChip({ label, selected, onClick }: MultiSelectChipProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-full font-picky-sans font-normal text-[14px] leading-[1.5] border transition-colors cursor-pointer outline-none',
        selected
          ? 'bg-brand-primary text-neutral-inverse border-brand-primary'
          : 'bg-neutral-primary text-neutral-primary border-neutral-primary',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
