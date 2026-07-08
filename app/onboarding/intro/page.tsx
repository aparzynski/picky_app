'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

const SLIDES = [
  {
    title: 'Dinner, sorted',
    subtitle: 'Meal plans that actually work for everyone at your table.',
    illustration: (
      <div className="w-[220px] h-[220px] rounded-[24px] bg-neutral-primary shadow-sm flex flex-col items-stretch p-4 gap-3">
        <div className="h-6 bg-brand-secondary rounded-full w-3/4 self-center" />
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-brand-primary shrink-0" />
          <div className="flex-1 h-3 bg-brand-quinary rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-brand-primary shrink-0" />
          <div className="flex-1 h-3 bg-brand-quinary rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-brand-primary shrink-0" />
          <div className="flex-1 h-3 bg-brand-quinary rounded-full w-2/3" />
        </div>
      </div>
    ),
  },
  {
    title: 'Every meal, everyone happy',
    subtitle: 'Picky learns what your family loves — and what they won\'t touch.',
    illustration: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-full bg-neutral-primary font-picky-sans font-semibold text-[13px] text-brand-primary border border-brand-primary shadow-sm">
            Kid-friendly
          </div>
          <div className="px-4 py-2 rounded-full bg-neutral-primary font-picky-sans font-semibold text-[13px] text-neutral-secondary border border-neutral-primary shadow-sm">
            Dairy-free
          </div>
        </div>
        <div className="w-[180px] h-[120px] rounded-[16px] bg-brand-quinary flex items-center justify-center">
          <span className="text-[48px]">🍝</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Your family cookbook',
    subtitle: 'Save recipes, build your collection, come back to the good ones.',
    illustration: (
      <div className="flex flex-col gap-3 w-[200px]">
        {['🍋 Lemon Herb Chicken', '🍝 Tuscan Pasta', '🌮 Beef Tacos'].map((name) => (
          <div key={name} className="flex items-center gap-3 bg-neutral-primary rounded-[12px] px-3 py-2 shadow-sm">
            <span className="text-[20px]">{name.split(' ')[0]}</span>
            <span className="font-picky-sans text-[13px] text-neutral-primary">{name.slice(3)}</span>
            <span className="ml-auto text-brand-primary text-[16px]">♥</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Use what you have',
    subtitle: 'Track your fridge, freezer, and pantry — and never waste food again.',
    illustration: (
      <div className="flex flex-col gap-2 w-[200px]">
        <div className="flex items-center gap-3 bg-neutral-primary rounded-[12px] px-3 py-2.5 shadow-sm border border-neutral-primary">
          <span className="text-[20px]">🥦</span>
          <div className="flex-1">
            <div className="font-picky-sans font-semibold text-[13px] text-neutral-primary">Broccoli</div>
            <div className="font-picky-sans text-[11px] text-warning-primary">⚠️ Expires in 2 days</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-neutral-primary rounded-[12px] px-3 py-2.5 shadow-sm border border-neutral-primary">
          <span className="text-[20px]">🍋</span>
          <div className="flex-1">
            <div className="font-picky-sans font-semibold text-[13px] text-neutral-primary">Lemons</div>
            <div className="font-picky-sans text-[11px] text-error-primary">⚠️ Expires tomorrow</div>
          </div>
        </div>
      </div>
    ),
  },
] as const;

export default function OnboardingIntroPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  function advance() {
    if (current < SLIDES.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      router.push('/onboarding/1');
    }
  }

  function skip() {
    router.push('/onboarding/1');
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 40 && current < SLIDES.length - 1) setCurrent((c) => c + 1);
    if (delta < -40 && current > 0) setCurrent((c) => c - 1);
  }

  const slide = SLIDES[current];

  return (
    <div
      className="flex flex-col h-dvh bg-brand-quinary overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide pagination dots */}
      <div className="flex items-center justify-center gap-1.5 pt-10 pb-4 shrink-0">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={
              i === current
                ? 'h-2 w-5 rounded-full bg-brand-primary'
                : 'h-2 w-2 rounded-full bg-brand-tertiary'
            }
          />
        ))}
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center px-8 min-h-0">
        {slide.illustration}
      </div>

      {/* Text */}
      <div className="px-8 pb-6 flex flex-col items-center gap-3 shrink-0">
        <h1 className="font-picky-hand font-semibold text-[28px] leading-[1.2] text-neutral-primary text-center">
          {slide.title}
        </h1>
        <p className="font-picky-sans font-normal text-[15px] leading-[1.6] text-neutral-secondary text-center">
          {slide.subtitle}
        </p>
      </div>

      {/* CTAs */}
      <div className="px-5 pb-10 flex flex-col gap-2 shrink-0">
        <Button variant="primary" size="lg" pill onClick={advance} className="w-full">
          {current < SLIDES.length - 1 ? 'Next →' : 'Get started →'}
        </Button>
        <button
          onClick={skip}
          className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-2"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
