'use client';

import { useRef } from 'react';
import { StatusBar } from '@/components/StatusBar';
import { EarlAvatar } from '@/components/EarlAvatar';
import { ProgressDots } from '@/components/ProgressDots';

type OnboardingLayoutProps = {
  step?: number;
  totalSteps?: number;
  showDots?: boolean;
  earlMessage: string;
  onBack?: () => void;
  onSwipeNext?: () => void;
  footer: React.ReactNode;
  children?: React.ReactNode;
};

export function OnboardingLayout({
  step,
  totalSteps = 9,
  showDots = true,
  earlMessage,
  onBack,
  onSwipeNext,
  footer,
  children,
}: OnboardingLayoutProps) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    // Ignore if vertical scroll dominates
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (Math.abs(dx) < 60) return;
    if (dx < 0 && onSwipeNext) onSwipeNext();
    if (dx > 0 && onBack) onBack();
  }

  return (
    <div
      className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Earl speech bubble — Figma: Onboarding Earl chat (658:15043) */}
      <div className="flex items-start gap-3 px-6 pt-2 pb-6 shrink-0">
        <EarlAvatar circle={false} />
        <div className="flex-1 bg-brand-tertiary rounded-[16px] rounded-tl-[4px] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] px-4 py-3">
          <p className="font-picky-sans font-normal text-[18px] leading-[1.5] text-neutral-primary">
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
