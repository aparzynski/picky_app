// Figma: Semantic Pill (597:12388)
// Variants: size: small | medium, type: warning | danger | success | info, variant: subtle | bold

type PillType = 'success' | 'warning' | 'danger' | 'info';
type PillVariant = 'subtle' | 'bold';

type SemanticPillProps = {
  label: string;
  type: PillType;
  size?: 'small' | 'medium';
  variant?: PillVariant;
};

const CONFIG: Record<PillType, Record<PillVariant, { bg: string; text: string }>> = {
  success: {
    subtle: { bg: 'bg-success-subtle', text: 'text-success-primary' },
    bold:   { bg: 'bg-success-bold',   text: 'text-success-inverse' },
  },
  warning: {
    subtle: { bg: 'bg-warning-subtle', text: 'text-warning-primary' },
    bold:   { bg: 'bg-warning-bold',   text: 'text-warning-inverse' },
  },
  danger: {
    subtle: { bg: 'bg-error-subtle',   text: 'text-error-primary'   },
    bold:   { bg: 'bg-error-bold',     text: 'text-error-inverse'   },
  },
  info: {
    subtle: { bg: 'bg-info-subtle',    text: 'text-info-primary'    },
    bold:   { bg: 'bg-info-bold',      text: 'text-info-inverse'    },
  },
};

export function SemanticPill({ label, type, size = 'small', variant = 'subtle' }: SemanticPillProps) {
  const { bg, text } = CONFIG[type][variant];
  const isSmall = size === 'small';

  return (
    <div className={`${bg} rounded-full inline-flex shrink-0 ${isSmall ? 'px-3 py-1' : 'px-4 py-2'}`}>
      <span className={`font-picky-sans whitespace-nowrap ${text} ${
        isSmall
          ? 'font-bold text-[12px] leading-[1.4]'
          : 'font-semibold text-[14px] leading-[1.5]'
      }`}>
        {label}
      </span>
    </div>
  );
}
