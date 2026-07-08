'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button';

type EarlsFirstWeekModalProps = {
  onDismiss: () => void;
};

export function EarlsFirstWeekModal({ onDismiss }: EarlsFirstWeekModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll-lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Focus trap
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const focusable = card.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-week-title"
    >
      {/* Opaque scrim — nothing bleeds through (Bug #1 fix) */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full bg-neutral-primary rounded-[20px] shadow-[0px_20px_60px_rgba(0,0,0,0.3)] px-6 pt-10 pb-8 flex flex-col items-center gap-4"
        style={{ maxWidth: 340 }}
      >
        {/* Confetti decorations */}
        <span className="absolute top-4 left-6 text-[18px] select-none" aria-hidden>✨</span>
        <span className="absolute top-3 right-10 text-[18px] select-none" aria-hidden>🎉</span>
        <span className="absolute top-8 right-5 text-[16px] select-none" aria-hidden>🎊</span>
        <span className="absolute top-12 left-8 text-[14px] select-none" aria-hidden>⭐</span>

        {/* Earl avatar — 64px */}
        <div
          className="flex items-center justify-center rounded-full bg-brand-primary shrink-0"
          style={{ width: 64, height: 64 }}
        >
          <div className="relative" style={{ width: 44, height: 48 }}>
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
        </div>

        <h2
          id="first-week-title"
          className="font-picky-hand font-semibold text-[22px] leading-[1.2] text-brand-primary text-center"
        >
          Your first week is ready!
        </h2>

        <p className="font-picky-sans font-normal text-[14px] leading-[1.6] text-neutral-secondary text-center">
          I went ahead and planned some meals based on what you told me. Swap anything that doesn&apos;t feel right — I won&apos;t take it personally. 🧅
        </p>

        <Button
          variant="primary"
          size="lg"
          pill
          onClick={onDismiss}
          className="w-full"
        >
          Let&apos;s see it!
        </Button>

        <button
          onClick={onDismiss}
          className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
