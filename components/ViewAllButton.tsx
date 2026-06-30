type ViewAllButtonProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
};

function ChevronRightIcon() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.833374 0.833374L5.83337 5.83337L0.833374 10.8334" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ViewAllButton({ label = "View All", onClick, className }: ViewAllButtonProps) {
  return (
    <button
      onClick={onClick}
     className={`flex items-center gap-2 cursor-pointer rounded-[4px] transition-colors text-brand-primary hover:text-brand-tertiary focus-visible:text-brand-quarternary outline-none ${className ?? ""}`}
    >
      <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] whitespace-nowrap">
        {label}
      </span>
      <div className="shrink-0 size-5 flex items-center justify-center">
        <ChevronRightIcon />
      </div>
    </button>
  );
}
