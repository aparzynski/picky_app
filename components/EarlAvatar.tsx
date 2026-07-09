// Figma: Earl Avatar (549:4800) — layered Earl mascot SVGs.
// circle=true (default): purple FAB circle, used in chat contexts.
// circle=false: bare illustration, used in onboarding chat rows.

function EarlLayers({ width, height }: { width: string | number; height: string | number }) {
  return (
    <div className="relative shrink-0" style={{ width, height }}>
      <div className="absolute inset-[2.49%_44.71%_15.81%_2.69%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 size-full" src="/assets/earl-highlight.svg" />
      </div>
      <div className="absolute inset-[3.9%_10.71%_7.81%_6.81%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 size-full" src="/assets/earl-facee.svg" />
      </div>
      <div className="absolute inset-[36.57%_2.6%_2.45%_5.54%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 size-full" src="/assets/earl-shadow.svg" />
      </div>
      <div className="absolute inset-[53.54%_24.84%_23.27%_25.09%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 size-full" src="/assets/earl-face.svg" />
      </div>
      <div className="absolute inset-[23.04%_21.85%_54.89%_58.91%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 size-full" src="/assets/earl-crease.svg" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute inset-0 size-full" src="/assets/earl-logo.svg" />
    </div>
  );
}

export function EarlAvatar({
  className,
  circle = true,
}: {
  className?: string;
  circle?: boolean;
}) {
  if (!circle) {
    // Natural Earl proportions: 101w × 112h ≈ 0.902 ratio → at height 48, width ≈ 43px
    return <EarlLayers width={43} height={48} />;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand-primary shrink-0 w-8 h-8 ${className ?? ''}`}
    >
      <EarlLayers width="22px" height="24px" />
    </div>
  );
}
