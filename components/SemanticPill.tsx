// Figma: Semantic Pill (658:17779)
// Variants: size: small | medium, type: warning | danger | success | info

type PillType = 'success' | 'warning' | 'danger' | 'info';

type SemanticPillProps = {
  label: string;
  type: PillType;
  size?: 'small' | 'medium';
};

const CONFIG: Record<PillType, { bg: string; text: string }> = {
  success: { bg: 'bg-success-subtle', text: 'text-success-primary' },
  warning: { bg: 'bg-warning-subtle', text: 'text-warning-primary' },
  danger:  { bg: 'bg-error-subtle',   text: 'text-error-primary'   },
  info:    { bg: 'bg-info-subtle',    text: 'text-info-primary'    },
};

export function SemanticPill({ label, type, size = 'small' }: SemanticPillProps) {
  const { bg, text } = CONFIG[type];
  const textSize = size === 'small' ? 'text-[12px]' : 'text-[14px]';

  return (
    <div className={`${bg} rounded-full px-2 py-0.5 inline-flex shrink-0`}>
      <span className={`font-picky-sans font-semibold ${textSize} leading-[1.4] ${text} whitespace-nowrap`}>
        {label}
      </span>
    </div>
  );
}
