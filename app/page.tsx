'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SLIDES = [
  {
    illustration: '/assets/intro-slide-1.png',
    alt: 'Earl the onion with chef hat, vegetables, and a meal plans clipboard',
    title: 'Dinner, sorted',
    subtitle: 'Meal plans that actually work for everyone at your table.',
  },
  {
    illustration: '/assets/intro-slide-2.png',
    alt: 'Earl the onion surrounded by Kid-Friendly and Dairy-Free recipe cards and hearts',
    title: 'Every meal, everyone happy',
    subtitle: "Picky learns what your family loves — and what they won't touch.",
  },
  {
    illustration: '/assets/intro-slide-3.png',
    alt: 'Earl the onion with chef hat reading a recipe book with mushrooms and tomatoes',
    title: 'Your family cookbook',
    subtitle: 'Save recipes, build your collection, come back to the good ones.',
  },
  {
    illustration: '/assets/intro-slide-4.png',
    alt: 'Earl the onion peeking out from behind an open fridge full of food',
    title: 'Use what you have',
    subtitle: 'Track your fridge, freezer, and pantry — and never waste food again.',
  },
] as const;

export default function IntroPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  function advance() {
    if (current < SLIDES.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      router.push('/welcome');
    }
  }

  function skip() {
    router.push('/welcome');
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
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 100%)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex-1 flex flex-col px-8 pt-16 pb-16 gap-16">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 bg-brand-quarternary'
                  : 'w-2 bg-neutral-disabled'
              }`}
            />
          ))}
        </div>

        {/* Illustration + text — fills remaining space */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.illustration}
              alt={slide.alt}
              width={300}
              height={300}
              className="w-[300px] h-[300px] object-contain"
              draggable={false}
            />
            <div className="w-[300px] flex flex-col items-center gap-3">
              <h1
                className="font-picky-hand font-semibold text-[32px] leading-[120%] text-center text-neutral-primary"
                style={{ letterSpacing: '-0.03em' }}
              >
                {slide.title}
              </h1>
              <p className="font-picky-sans font-normal text-base leading-[150%] text-center text-neutral-secondary">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={advance}
            className="w-full bg-brand-primary text-brand-inverse font-picky-sans font-semibold text-lg rounded-full py-3 px-5"
          >
            {current < SLIDES.length - 1 ? 'Next →' : 'Get started →'}
          </button>
          <button
            onClick={skip}
            className="font-picky-sans font-semibold text-lg text-brand-primary"
          >
            Skip
          </button>
        </div>

      </div>
    </div>
  );
}
