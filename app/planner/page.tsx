'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { Avatar } from '@/components/Avatar';

// ─── Types ───────────────────────────────────────────────────────────────────

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';
type AvatarColor = 'purple' | 'blue' | 'orange' | 'green';

type Meal = {
  type: MealType;
  name: string;
  emoji: string;
  cookTime: number;
  hasMeal: boolean;
};

type PlannerDay = {
  id: string;
  name: string;
  date: string;
  isPast: boolean;
  isToday: boolean;
  meals: Meal[];
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const WEEK_HEADER = 'Jun 29 – Jul 5';

const FAMILY: { initials: string; color: AvatarColor }[] = [
  { initials: 'S', color: 'purple' },
  { initials: 'D', color: 'blue' },
  { initials: 'M', color: 'orange' },
  { initials: 'N', color: 'green' },
  { initials: 'L', color: 'orange' },
];

function noMeal(type: MealType): Meal {
  return { type, name: '', emoji: '', cookTime: 0, hasMeal: false };
}

function hasMeal(type: MealType, name: string, emoji: string, cookTime: number): Meal {
  return { type, name, emoji, cookTime, hasMeal: true };
}

const PAST_DAYS: PlannerDay[] = [
  {
    id: 'mon',
    name: 'Monday',
    date: 'Jun 29',
    isPast: true,
    isToday: false,
    meals: [
      hasMeal('BREAKFAST', 'Berry Overnight Oats', '🍓', 5),
      hasMeal('LUNCH', 'Fresh Garden Caprese', '🍅', 10),
      hasMeal('DINNER', 'Honey Teriyaki Salmon', '🐟', 25),
    ],
  },
];

const WEEKDAY_DAYS: PlannerDay[] = [
  {
    id: 'tue',
    name: 'Tuesday',
    date: 'Jun 30',
    isPast: false,
    isToday: true,
    meals: [
      noMeal('BREAKFAST'),
      hasMeal('LUNCH', 'Hidden Veggie Mac & Cheese', '🧀', 25),
      hasMeal('DINNER', 'Creamy Tuscan Pasta', '🍝', 35),
    ],
  },
  {
    id: 'wed',
    name: 'Wednesday',
    date: 'Jul 1',
    isPast: false,
    isToday: false,
    meals: [
      noMeal('BREAKFAST'),
      noMeal('LUNCH'),
      hasMeal('DINNER', 'Crispy Baked Nuggets', '🍗', 20),
    ],
  },
  {
    id: 'thu',
    name: 'Thursday',
    date: 'Jul 2',
    isPast: false,
    isToday: false,
    meals: [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')],
  },
  {
    id: 'fri',
    name: 'Friday',
    date: 'Jul 3',
    isPast: false,
    isToday: false,
    meals: [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')],
  },
];

const WEEKEND_DAYS: PlannerDay[] = [
  {
    id: 'sat',
    name: 'Saturday',
    date: 'Jul 4',
    isPast: false,
    isToday: false,
    meals: [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')],
  },
  {
    id: 'sun',
    name: 'Sunday',
    date: 'Jul 5',
    isPast: false,
    isToday: false,
    meals: [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')],
  },
];

const SESSION_KEY = 'planner_past_banner_dismissed';

// ─── Sub-components ───────────────────────────────────────────────────────────

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.167 2.5a1.768 1.768 0 0 1 2.5 0l.833.833a1.768 1.768 0 0 1 0 2.5L6.25 17.083H2.917v-3.333L14.167 2.5Z"
        stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 5h15M6.667 5V3.333a1.667 1.667 0 0 1 1.666-1.666h3.334a1.667 1.667 0 0 1 1.666 1.666V5m2.5 0v11.667a1.667 1.667 0 0 1-1.666 1.666H5.833a1.667 1.667 0 0 1-1.666-1.666V5h11.667Z"
        stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MealRow({ meal, isPast, isLast }: { meal: Meal; isPast: boolean; isLast: boolean }) {
  const borderClass = isLast
    ? ''
    : isPast
      ? 'border-b border-neutral-secondary'
      : 'border-b border-neutral-primary';

  if (meal.hasMeal) {
    const cardBg = isPast ? 'bg-neutral-secondary' : 'bg-brand-tertiary';
    return (
      <div className={`flex flex-col gap-2 pt-1 pb-2 ${borderClass}`}>
        <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
          {meal.type}
        </span>
        <div className={`flex items-center rounded-[8px] px-3 py-3 gap-3 ${cardBg}`}>
          <span className="text-[24px] leading-8 shrink-0">{meal.emoji}</span>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] truncate">
              {meal.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
                ⏱️ {meal.cookTime} min
              </span>
              <div className="flex items-center">
                {FAMILY.map((a, i) => (
                  <Avatar
                    key={i}
                    initials={a.initials}
                    color={a.color}
                    size={16}
                    className={`border border-brand-primary ${i > 0 ? '-ml-1' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-neutral-tertiary">
            <button aria-label="Edit meal"><EditIcon /></button>
            <button aria-label="Remove meal"><TrashIcon /></button>
          </div>
        </div>
      </div>
    );
  }

  // No meal planned
  const noMealLabel = isPast ? 'No Meal Planned' : 'Let me suggest something';
  const noMealColor = isPast ? 'text-neutral-disabled' : 'text-brand-primary';

  return (
    <div className={`flex items-center justify-between pt-2 pb-4 ${borderClass}`}>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
          {meal.type}
        </span>
        <div className="flex items-center">
          {FAMILY.map((a, i) => (
            <Avatar
              key={i}
              initials={a.initials}
              color={a.color}
              size={24}
              className={`border border-brand-primary ${i > 0 ? '-ml-[10px]' : ''}`}
            />
          ))}
        </div>
      </div>
      <span className={`text-[12px] font-semibold font-picky-sans ${noMealColor} tracking-[0.02em] leading-[1.4] text-right max-w-[40%]`}>
        {noMealLabel}
      </span>
    </div>
  );
}

function WeekdayCardEl({ day }: { day: PlannerDay }) {
  const cardBg = day.isPast ? 'bg-neutral-tertiary' : 'bg-neutral-primary';
  return (
    <div className={`${cardBg} rounded-[16px] px-4 py-3 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between h-6">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
            {day.name}
          </span>
          <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
            {day.date}
          </span>
        </div>
        {day.isToday && (
          <span className="bg-brand-primary text-brand-inverse text-[12px] font-normal font-picky-sans leading-[1.4] rounded-full px-2 py-0.5">
            Today
          </span>
        )}
      </div>
      {/* Meal rows */}
      <div className="flex flex-col pt-2 pb-2 gap-0">
        {day.meals.map((meal, i) => (
          <MealRow
            key={meal.type}
            meal={meal}
            isPast={day.isPast}
            isLast={i === day.meals.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function WeekendDivider() {
  return (
    <div className="flex items-center gap-3 py-3 px-0">
      <div className="flex-1 h-px bg-neutral-tertiary" />
      <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4] uppercase">
        Weekend
      </span>
      <div className="flex-1 h-px bg-neutral-tertiary" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const initialScrollTopRef = useRef<number | null>(null);

  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Hydrate banner dismissed state from sessionStorage
  useEffect(() => {
    setBannerDismissed(sessionStorage.getItem(SESSION_KEY) === 'true');
  }, []);

  // Scroll to banner position on initial load (uses getBoundingClientRect to
  // compute position relative to the scroll container, not the document)
  useEffect(() => {
    if (bannerDismissed) return;
    const frame = requestAnimationFrame(() => {
      if (scrollRef.current && bannerRef.current) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const bannerRect = bannerRef.current.getBoundingClientRect();
        const targetScrollTop =
          scrollRef.current.scrollTop + (bannerRect.top - containerRect.top);
        scrollRef.current.scrollTop = targetScrollTop;
        initialScrollTopRef.current = targetScrollTop;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [bannerDismissed]);

  function handleScroll() {
    if (bannerDismissed || initialScrollTopRef.current === null || !scrollRef.current) return;
    if (scrollRef.current.scrollTop < initialScrollTopRef.current - 20) {
      setBannerDismissed(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Header */}
      <div className="bg-neutral-primary flex flex-col shrink-0">
        {/* Row 1: nav + title */}
        <div className="flex items-center justify-between h-[61px] px-4 border-b border-neutral-primary">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-1">
            <span className="text-[18px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
              This Week
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-neutral-primary">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <button
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary"
            aria-label="Add"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Row 2: date range nav */}
        <div className="flex items-center gap-2 h-[45px] px-4 border-b border-neutral-primary">
          <button className="text-neutral-secondary" aria-label="Previous week">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[14px] font-semibold font-picky-sans text-neutral-secondary leading-[1.5]">
            {WEEK_HEADER}
          </span>
          <button className="text-neutral-secondary" aria-label="Next week">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-neutral-disabled"
      >
        <div className="flex flex-col gap-2 px-4 pt-4 pb-4">

          {/* Past days (scrolled above the fold on first load) */}
          <div className="flex flex-col gap-3">
            {PAST_DAYS.map((day) => (
              <WeekdayCardEl key={day.id} day={day} />
            ))}
          </div>

          {/* Past Days Banner — positioned at top of initial viewport */}
          {!bannerDismissed && (
            <div
              ref={bannerRef}
              className="flex items-center justify-center py-2"
            >
              <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
                ↑ Swipe Up to View Past Days
              </span>
            </div>
          )}

          {/* Weekday cards (Mon–Fri) */}
          <div className="flex flex-col gap-3">
            {WEEKDAY_DAYS.map((day) => (
              <WeekdayCardEl key={day.id} day={day} />
            ))}
          </div>

          {/* Weekend divider + weekend cards */}
          <WeekendDivider />
          <div className="flex flex-col gap-3">
            {WEEKEND_DAYS.map((day) => (
              <WeekdayCardEl key={day.id} day={day} />
            ))}
          </div>

        </div>
      </div>

      <BottomNav activeTab="planner" />
    </div>
  );
}
