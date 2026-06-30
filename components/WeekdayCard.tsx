import Image from "next/image";

type WeekdayCardProps = {
  dayLabel: string;
  emojis?: string[];
  mealCount: number;
  currentDay?: boolean;
  className?: string;
};

export function WeekdayCard({
  dayLabel,
  emojis = [],
  mealCount,
  currentDay = false,
  className,
}: WeekdayCardProps) {
  const isEmpty = mealCount === 0;

  if (isEmpty) {
    return (
      <div
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

  if (currentDay) {
    return (
      <div
        className={`relative flex flex-col items-center justify-between min-w-[72px] self-stretch shrink-0 rounded-[var(--l,16px)] border border-brand-primary bg-brand-primary drop-shadow-[0px_4px_7px_rgba(44,2,56,0.15)] px-[5px] py-[13px] cursor-pointer ${className ?? ""}`}
      >
        <div className="flex flex-col items-start pb-2">
          <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-inverse">
            {dayLabel}
          </span>
        </div>
        <div className="flex flex-col items-start pb-2">
          <div className="flex items-center justify-center size-10 rounded-full bg-brand-quarternary drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
            <span className="text-[20px] leading-7">{emojis[0] ?? "🍽️"}</span>
          </div>
        </div>
        <span className="font-picky-sans font-semibold text-[10px] leading-[1.5] text-neutral-inverse">
          {mealCount} {mealCount === 1 ? "meal" : "meals"}
        </span>
      </div>
    );
  }

  const overlapMr = mealCount >= 3 ? "-27px" : "-18px";
  const visibleEmojis = emojis.slice(0, Math.min(mealCount, 3));

  return (
    <div
      className={`relative flex flex-col items-center justify-between min-w-[72px] self-stretch shrink-0 rounded-[var(--l,16px)] border border-neutral-primary bg-neutral-secondary px-[3px] py-[13px] cursor-pointer ${className ?? ""}`}
    >
      <div className="flex flex-col items-start pb-2">
        <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-secondary">
          {dayLabel}
        </span>
      </div>
      <div className="flex items-start pb-2">
        {visibleEmojis.map((emoji, i) => (
          <div
            key={i}
            className="flex items-center justify-center size-10 rounded-full bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] shrink-0"
            style={{
              marginRight: i < visibleEmojis.length - 1 ? overlapMr : undefined,
            }}
          >
            <span className="text-[20px] leading-7">{emoji}</span>
          </div>
        ))}
      </div>
      <span className="font-picky-sans font-normal text-[10px] leading-[1.4] text-neutral-tertiary">
        {mealCount} {mealCount === 1 ? "meal" : "meals"}
      </span>
    </div>
  );
}
