"use client";

import Link from 'next/link';
import { StatusBar } from '@/components/StatusBar';
import { OnionRingsBackground, WELCOME_GRADIENT } from '@/components/WelcomeBackground';

function EarlIllustration() {
  return (
    <div className="relative" style={{ width: '101px', height: '112px' }}>
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

export default function WelcomePage() {
  return (
    <div
      className="relative flex flex-col h-dvh overflow-hidden"
      style={{
        background: WELCOME_GRADIENT,
      }}
    >
      <OnionRingsBackground />
      <StatusBar />

      <div className="relative flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-16">
        <div className="flex items-center justify-center h-[112px]">
          <EarlIllustration />
        </div>

        <div className="flex flex-col gap-4 items-center text-center w-[320px]">
          <h1 className="font-picky-hand font-normal text-[32px] leading-[1.2] tracking-[-0.03em] text-[#7c019d]">
            Welcome to Picky!
          </h1>
          <p className="font-picky-sans font-normal text-[18px] leading-[1.5] text-neutral-secondary">
            Picky is a prototype created by Ariel Parzynski. To get the full effect, start with the onboarding flow!
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 w-full">
          <Link
            href="/onboarding/1"
            className="w-full flex items-center justify-center bg-brand-primary text-brand-inverse rounded-full px-5 py-3 shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)] outline-none transition-colors hover:bg-brand-secondary hover:text-brand-primary focus-visible:bg-brand-secondary focus-visible:border-2 focus-visible:border-brand-primary focus-visible:text-brand-primary active:bg-brand-quarternary"
          >
            <span className="font-picky-sans font-semibold text-[18px] leading-[1.5] whitespace-nowrap">
              Start Onboarding
            </span>
          </Link>

          <Link
            href="/home"
            className="flex items-center justify-center px-5 py-3 text-brand-primary outline-none transition-colors hover:text-brand-secondary focus-visible:text-brand-secondary active:text-brand-quarternary"
          >
            <span className="font-picky-sans font-semibold text-[18px] leading-[1.5] whitespace-nowrap">
              Skip to the Home Screen
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
