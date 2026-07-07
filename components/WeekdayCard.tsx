import Image from "next/image";

type WeekdayCardProps = {
  dayLabel: string;
  emojis?: string[];
  mealCount: number;
  currentDay?: boolean;
  onClick?: () => void;
  className?: string;
};

export function WeekdayCard({
  dayLabel,
  emojis = [],
  mealCount,
  currentDay = false,
  onClick,
  className,
}: WeekdayCardProps) {
  const isEmpty = mealCount === 0;

  // 0 meals — dashed empty state
  if (isEmpty) {
    return (
      <div
        onClick={onClick}
        className={`relative flex flex-col items-center justify-between min-w-[72px] self-stretch shrink-0 rounded-[var(--l,16px)] border-2 border-dashed border-neutral-primary px-[6px] py-[14px] cursor-pointer ${className ?? ""}`}
      >
        <span className="font-picky-sans font-bold text-[13px] leading-[1.5] text-neutral-disabled">
          {dayLabel}
        </span>
        <div className="flex flex-col items-start pb-2">
          <div className="flex items-center justify-center size-10">
            <div className="relative size-6 shrink-0">
              <Image src="/assets/icon-plus.svg" alt="Plan meal" fill className="object-contain" />
            </div>
          </div>
        </div>
        <div className="h-[15px]" />
      </div>
    );
  }

  // 1–3 meals — currentDay uses purple bg + purple circles; otherwise white bg + white circles
  const containerBg = currentDay
    ? "bg-brand-primary border-brand-primary drop-shadow-[0px_4px_7px_rgba(44,2,56,0.15)]"
    : "bg-neutral-secondary border-neutral-primary";
  const px = mealCount >= 3 ? "px-[3px]" : "px-[5px]";
  const circleBg = currentDay ? "bg-brand-quarternary" : "bg-white";
  const labelColor = currentDay ? "text-neutral-inverse" : "text-neutral-secondary";
  const countColor = currentDay ? "text-neutral-inverse font-semibold" : "text-neutral-tertiary font-normal";

  const overlapMr = mealCount >= 3 ? "-27px" : "-18px";
  const visibleEmojis = emojis.slice(0, Math.min(mealCount, 3));

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-between min-w-[72px] self-stretch shrink-0 rounded-[var(--l,16px)] border ${containerBg} ${px} py-[13px] cursor-pointer ${className ?? ""}`}
    >
      <div className="flex flex-col items-start pb-2">
        <span className={`font-picky-sans font-semibold text-[14px] leading-[1.5] ${labelColor}`}>
          {dayLabel}
        </span>
      </div>
      <div className="flex items-start pb-2">
        {visibleEmojis.map((emoji, i) => (
          <div
            key={i}
            className={`flex items-center justify-center size-10 rounded-full ${circleBg} drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] shrink-0`}
            style={{ marginRight: i < visibleEmojis.length - 1 ? overlapMr : undefined }}
          >
            <span className="text-[20px] leading-7">{emoji}</span>
          </div>
        ))}
      </div>
      <span className={`font-picky-sans text-[10px] leading-[1.4] ${countColor}`}>
        {mealCount} {mealCount === 1 ? "meal" : "meals"}
      </span>
    </div>
  );
}
