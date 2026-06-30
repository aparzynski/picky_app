'use client';

import { useState } from 'react';

// Figma: Recipe Accordion (675:7439)
// Variants: color=yellow|purple, expanded=true|false

type RecipeAccordionProps = {
  color: 'yellow' | 'purple';
  expanded?: boolean;
  title: string;
  body: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RecipeAccordion({
  color,
  expanded: initialExpanded = true,
  title,
  body,
  ctaLabel,
  onCtaClick,
}: RecipeAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const isYellow = color === 'yellow';
  const bgClass = isYellow ? 'bg-brand-2-tertiary' : 'bg-brand-tertiary';
  const borderClass = isYellow ? 'border-brand-2-primary' : 'border-brand-primary';
  const textClass = isYellow ? 'text-brand-2-primary' : 'text-brand-primary';

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-[16px] border ${bgClass} ${borderClass}`}>
      {/* Header row */}
      <button
        onClick={() => setIsExpanded(v => !v)}
        className="flex items-start justify-between gap-2 w-full text-left cursor-pointer outline-none"
      >
        <span className={`font-picky-sans font-normal text-[14px] leading-[1.4] ${textClass}`}>
          {title}
        </span>
        <div className={`shrink-0 size-4 ${textClass}`}>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </button>

      {/* Expandable body */}
      {isExpanded && (
        <>
          <p className={`font-picky-sans font-normal text-[14px] leading-[1.4] ${textClass}`}>
            {body}
          </p>

          {ctaLabel && (
            <button
              onClick={onCtaClick}
              className={`flex items-center gap-1 self-start rounded-full px-2 py-0.5 outline-none cursor-pointer transition-opacity hover:opacity-80 ${textClass}`}
            >
              <span className={`font-picky-sans font-normal text-[12px] leading-[1.4] ${textClass}`}>
                {ctaLabel}
              </span>
              <div className={`shrink-0 size-4 ${textClass}`}>
                <ChevronRightIcon />
              </div>
            </button>
          )}
        </>
      )}
    </div>
  );
}
