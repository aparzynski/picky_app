type QuickActionCardProps = {
  iconSrc: string;
  title: string;
  subtitle: string;
  iconSize?: number;
  className?: string;
};

export function QuickActionCard({
  iconSrc,
  title,
  subtitle,
  iconSize = 20,
  className,
}: QuickActionCardProps) {
  return (
    <a
      className={`flex flex-1 flex-col items-center gap-2 rounded-[var(--xl,20px)] p-4 min-w-0 cursor-pointer self-stretch bg-brand-tertiary ${className ?? ""}`}
    >
      <div className="flex items-center justify-center size-10 rounded-full shrink-0 bg-brand-quinary">
        <div
          className="shrink-0 bg-icon-brand-primary"
          style={{
            width: iconSize,
            height: iconSize,
            WebkitMaskImage: `url(${iconSrc})`,
            maskImage: `url(${iconSrc})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full">
        <p className="font-picky-sans font-bold text-[12px] leading-[1.4] text-neutral-secondary text-center">
          {title}
        </p>
        <p className="font-picky-sans font-semibold text-[10px] leading-[1.5] text-brand-primary text-center whitespace-nowrap">
          {subtitle}
        </p>
      </div>
    </a>
  );
}
