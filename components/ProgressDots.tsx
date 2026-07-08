type ProgressDotsProps = {
  step: number;
  total?: number;
};

export function ProgressDots({ step, total = 7 }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const active = i + 1 === step;
        return (
          <div
            key={i}
            className={
              active
                ? 'h-2 w-5 rounded-full bg-brand-primary'
                : 'h-2 w-2 rounded-full bg-neutral-disabled'
            }
          />
        );
      })}
    </div>
  );
}
