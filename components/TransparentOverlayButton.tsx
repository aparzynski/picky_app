type TransparentOverlayButtonSize = "medium" | "large";

type TransparentOverlayButtonProps = {
  size?: TransparentOverlayButtonSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const BOOKMARK_PATH =
  "M8.66663 3.33329V12.6666L4.66663 9.99996L0.666626 12.6666V3.33329C0.666626 2.62605 0.947577 1.94777 1.44767 1.44767C1.94777 0.947577 2.62605 0.666626 3.33329 0.666626H5.99996C6.7072 0.666626 7.38548 0.947577 7.88558 1.44767C8.38567 1.94777 8.66663 2.62605 8.66663 3.33329Z";

function BookmarkIcon({ selected, large }: { selected: boolean; large: boolean }) {
  const w = large ? 15 : 10;
  const h = large ? 21 : 14;
  return (
    <svg width={w} height={h} viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      {selected ? (
        <path d={BOOKMARK_PATH} fill="currentColor" />
      ) : (
        <path d={BOOKMARK_PATH} stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function TransparentOverlayButton({
  size = "medium",
  selected = false,
  disabled = false,
  onClick,
  className,
}: TransparentOverlayButtonProps) {
  const iconSlot = size === "medium" ? "size-4" : "size-6";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
     className={[
        "flex items-center justify-center rounded-full p-2 cursor-pointer transition-colors outline-none",
        "text-icon-brand-primary bg-overlay-neutral-primary",
        "hover:bg-overlay-neutral-secondary",
        "focus-visible:bg-overlay-neutral-secondary focus-visible:border focus-visible:border-brand-primary",
        "disabled:bg-overlay-neutral-disabled disabled:text-neutral-disabled disabled:cursor-not-allowed",
        className ?? "",
      ].join(" ")}
    >
      <div className={`shrink-0 ${iconSlot} flex items-center justify-center`}>
        <BookmarkIcon selected={selected} large={size === "large"} />
      </div>
    </button>
  );
}