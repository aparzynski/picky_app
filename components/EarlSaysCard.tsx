import Image from "next/image";
import { Button } from "./Button";

type EarlSaysCardProps = {
  message: string;
  ctaLabel?: string;
  variant?: "plan-day" | "setup-pantry" | "staple-reminder";
  buttonCount?: "1" | "3";
  suggestions?: string[];
  onCta?: () => void;
  onSuggestion?: (item: string) => void;
  onDismiss?: () => void;
  className?: string;
};

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8334 0.833374L0.833374 10.8334M0.833374 0.833374L10.8334 10.8334" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EarlSaysCard({
  message,
  ctaLabel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant,
  suggestions,
  onCta,
  onSuggestion,
  onDismiss,
  className,
}: EarlSaysCardProps) {
  return (
    <div
      className={`relative flex gap-4 items-start rounded-[24px] border border-brand-primary bg-brand-tertiary p-5 drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] w-full ${className ?? ""}`}
    >
      {/* Earl avatar — logo-earl.svg is the correct flat composed asset (Figma EarlSaysCard uses single image, not multi-layer) */}
      <div className="relative flex items-center justify-center size-[55px] shrink-0 rounded-full bg-brand-primary p-2">
        <div className="relative w-[36px] h-[40px]">
          <Image src="/assets/logo-earl.svg" alt="Earl" fill className="object-contain" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="font-picky-sans font-semibold text-[12px] leading-[1.4] tracking-[0.24px] text-brand-secondary whitespace-nowrap">
          Earl Says
        </p>
        <div className="flex flex-col gap-3 items-start">
          <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-primary">
            {message}
          </p>
          {suggestions && suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => onSuggestion?.(s)}
                  className="flex items-center gap-1 bg-neutral-primary border border-brand-primary rounded-full px-4 py-2 font-picky-sans font-semibold text-[12px] leading-[1.4] tracking-[0.24px] text-brand-primary cursor-pointer hover:bg-neutral-secondary transition-colors outline-none"
                >
                  <span>+</span>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          ) : ctaLabel ? (
            <Button variant="primary" size="md" pill onClick={onCta}>
              {ctaLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Dismiss — Icon/Neutral/Primary color via text-neutral-primary → currentColor */}
      <button
        onClick={onDismiss}
        className="absolute right-2 top-[7px] flex items-center justify-center p-2 rounded-full text-neutral-primary cursor-pointer"
        aria-label="Dismiss"
      >
        <div className="size-5 shrink-0 flex items-center justify-center">
          <CloseIcon />
        </div>
      </button>
    </div>
  );
}
