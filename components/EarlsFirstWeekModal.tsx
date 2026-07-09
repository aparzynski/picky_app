'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

type EarlsFirstWeekModalProps = {
  onDismiss: () => void;
};

export function EarlsFirstWeekModal({ onDismiss }: EarlsFirstWeekModalProps) {
  const router = useRouter();
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

  function handleLetsSeeit() {
    onDismiss();
    router.push('/planner');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-week-title"
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full bg-neutral-primary rounded-[32px] shadow-[0px_20px_25px_rgba(44,2,56,0.09),0px_4px_7px_rgba(44,2,56,0.15)] px-6 py-8 flex flex-col items-center gap-6"
        style={{ maxWidth: 340 }}
      >
        {/* Avatar + floating emojis — emojis are absolute to this 96×96 square */}
        <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
          {/* ✨ upper-left */}
          <span
            className="absolute text-[24px] leading-none select-none pointer-events-none"
            style={{ top: -16, left: -20 }}
            aria-hidden
          >✨</span>
          {/* 🎉 upper-right */}
          <span
            className="absolute text-[28px] leading-none select-none pointer-events-none"
            style={{ top: -4, left: 84 }}
            aria-hidden
          >🎉</span>
          {/* 🎊 right-middle */}
          <span
            className="absolute text-[20px] leading-none select-none pointer-events-none"
            style={{ top: 41, left: 100 }}
            aria-hidden
          >🎊</span>
          {/* ⭐ lower-left */}
          <span
            className="absolute text-[20px] leading-none select-none pointer-events-none"
            style={{ top: 68, left: -30 }}
            aria-hidden
          >⭐</span>

          {/* Earl — 96px purple circle, 6px border, 6px inner padding */}
          <div
            className="absolute inset-0 rounded-full bg-brand-primary border-[6px] border-[#ece8ed] p-[6px] flex items-center justify-center shadow-[0px_4px_7px_rgba(44,2,56,0.15)]"
          >
            <div className="relative" style={{ width: 53, height: 59 }}>
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
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-4 w-full text-center">
          <h2
            id="first-week-title"
            className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-[#7c019d] w-full"
          >
            Your first week is ready!
          </h2>
          <p className="font-picky-sans font-normal text-[18px] leading-[1.5] text-neutral-secondary w-full">
            I went ahead and planned some meals based on what you told me. Swap anything that doesn&apos;t feel right — I won&apos;t take it personally. 🧅
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-5">
          <Button
            variant="primary"
            size="lg"
            pill
            onClick={handleLetsSeeit}
            className="shadow-[0px_10px_15px_rgba(44,2,56,0.11),0px_4px_7px_rgba(44,2,56,0.15)]"
          >
            Let&apos;s see it!
          </Button>
          <button
            onClick={onDismiss}
            className="font-picky-sans font-semibold text-[18px] leading-[1.5] text-brand-primary cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
