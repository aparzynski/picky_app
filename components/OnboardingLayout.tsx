'use client';

import { StatusBar } from '@/components/StatusBar';
import { EarlAvatar } from '@/components/EarlAvatar';
import { ProgressDots } from '@/components/ProgressDots';

type OnboardingLayoutProps = {
  step?: number;
  totalSteps?: number;
  showDots?: boolean;
  earlMessage: string;
  onBack?: () => void;
  footer: React.ReactNode;
  children?: React.ReactNode;
};

export function OnboardingLayout({
  step,
  totalSteps = 7,
  showDots = true,
  earlMessage,
  onBack,
  footer,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Back arrow + dots row */}
      <div className="flex items-center px-5 pt-2 pb-3 shrink-0">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="text-neutral-secondary cursor-pointer p-1 -ml-1 mr-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10l5-5"
                stroke="currentColor"
                strokeWidth="1.667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <div className="w-[28px] mr-2" />
        )}
        {showDots && step !== undefined ? (
          <div className="flex-1 flex justify-center">
            <ProgressDots step={step} total={totalSteps} />
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <div className="w-[28px] ml-2" />
      </div>

      {/* Earl speech bubble */}
      <div className="flex items-start gap-3 px-5 pb-4 shrink-0">
        <EarlAvatar className="mt-1 shrink-0 w-10 h-10" />
        <div className="flex-1 bg-brand-quinary rounded-[16px] rounded-tl-none px-4 py-3">
          <p className="font-picky-sans font-normal text-[15px] leading-[1.5] text-neutral-primary">
            {earlMessage}
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pb-4">
        {children}
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 px-5 pb-8 pt-3 flex flex-col gap-2 bg-neutral-primary">
        {footer}
      </div>
    </div>
  );
}
