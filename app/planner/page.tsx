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
  recipeId?: string;
  family?: string[];
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

const FAMILY: { initials: string; color: AvatarColor }[] = [
  { initials: 'S', color: 'purple' },
  { initials: 'D', color: 'blue' },
  { initials: 'M', color: 'orange' },
  { initials: 'N', color: 'green' },
  { initials: 'L', color: 'orange' },
];

const FAMILY_BY_INITIAL = Object.fromEntries(FAMILY.map((f) => [f.initials, f]));

function noMeal(type: MealType): Meal {
  return { type, name: '', emoji: '', cookTime: 0, hasMeal: false };
}

function hasMeal(type: MealType, name: string, emoji: string, cookTime: number, recipeId?: string, family?: string[]): Meal {
  return { type, name, emoji, cookTime, hasMeal: true, recipeId, family };
}

// Meals by Mon-based day index (0=Mon … 6=Sun). Tonight's dinner (r1) is
// injected dynamically onto whichever index matches today.
const MEALS_BY_DAY_IDX: Record<number, Meal[]> = {
  0: [hasMeal('BREAKFAST','Strawberry Chia Pudding','🍓',5,'pw1',['S','D','M','N','L']), hasMeal('LUNCH','Turkey & Avocado Wrap','🥑',10,'pw2',['S','M']), hasMeal('DINNER','Lemon Herb Sheet Pan Chicken','🍋',35,'pw3',['S','D','N','L'])],
  1: [hasMeal('BREAKFAST','Blueberry Smoothie Bowl','🫐',10,'pw4',['S','D','N','L']), hasMeal('LUNCH','Tomato Soup & Grilled Cheese','🍅',20,'pw5',['S','N','L']), hasMeal('DINNER','Creamy Tuscan Pasta','🍝',35,'r1',['S','D','M','N','L'])],
  2: [hasMeal('BREAKFAST','Cheesy Egg Muffins','🧀',25,'pw7',['S','D']), hasMeal('LUNCH','Rainbow Sushi Bowl','🍱',15,'pw8',['S','M']), hasMeal('DINNER','Honey Garlic Salmon Bowls','🐟',30,'pw6',['S','D','N','L'])],
  3: [hasMeal('BREAKFAST','Coconut Granola Parfait','🥥',5,'pw10',['S','D','M','N','L']), hasMeal('LUNCH','Turkey Club Sandwich','🥪',10,'pw11',['S','D']), hasMeal('DINNER','Slow Cooker Pulled Pork Tacos','🌮',360,'pw9',['S','D','N','L'])],
  4: [hasMeal('BREAKFAST','Cinnamon French Toast Sticks','🍞',25,'pw13',['S','D','M','N','L']), hasMeal('LUNCH','Sesame Noodle Salad','🍜',15,'pw14',['S','M']), hasMeal('DINNER','Pan-Seared Tilapia & Asparagus','🐟',25,'pw12',['S','D','M','N','L'])],
  5: [noMeal('BREAKFAST'), noMeal('LUNCH'), hasMeal('DINNER','4th of July Backyard Burgers','🍔',30,'pw16',['S','D','M','N','L'])],
  6: [noMeal('BREAKFAST'), noMeal('LUNCH'), hasMeal('DINNER','Sunday Roast Chicken','🍗',90,'pw17',['S','D','M','N','L'])],
};

const DAY_IDS   = ['mon','tue','wed','thu','fri','sat','sun'] as const;
const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const;

function buildWeek() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun … 6=Sat
  const todayIdx = dow === 0 ? 6 : dow - 1; // Convert to Mon-based (0=Mon … 6=Sun)

  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIdx);
  monday.setHours(0, 0, 0, 0);

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const weekHeader = `${fmt(dates[0])} – ${fmt(dates[6])}`;

  const plannerDays: PlannerDay[] = dates.map((date, i) => {
    const baseMeals = MEALS_BY_DAY_IDX[i] ?? [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')];
    // Always put Creamy Tuscan Pasta as tonight's dinner
    const meals = i === todayIdx
      ? baseMeals.map((m) => m.type === 'DINNER' ? hasMeal('DINNER','Creamy Tuscan Pasta','🍝',35,'r1',['S','D','M','N','L']) : m)
      : baseMeals;
    return {
      id: DAY_IDS[i],
      name: DAY_NAMES[i],
      date: fmt(date),
      isPast: i < todayIdx,
      isToday: i === todayIdx,
      meals,
    };
  });

  return {
    weekHeader,
    pastDays:    plannerDays.filter((_, i) => i < todayIdx),
    weekdayDays: plannerDays.filter((_, i) => i >= todayIdx && i <= 4),
    weekendDays: plannerDays.filter((_, i) => i >= 5),
  };
}

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

function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 7.5h12.5M12.5 5l2.5 2.5-2.5 2.5M17.5 12.5H5M7.5 10l-2.5 2.5 2.5 2.5"
        stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MealRow({ meal, isPast, isLast, dayName, isToday }: { meal: Meal; isPast: boolean; isLast: boolean; dayName: string; isToday: boolean }) {
  const router = useRouter();
  const borderClass = isLast
    ? ''
    : isPast
      ? 'border-b border-neutral-secondary'
      : 'border-b border-neutral-primary';

  if (meal.hasMeal) {
    const cardBg = isPast ? 'bg-neutral-secondary' : 'bg-brand-tertiary';
    const members = meal.family
      ? meal.family.map((id) => FAMILY_BY_INITIAL[id]).filter(Boolean)
      : FAMILY;
    return (
      <div className={`flex flex-col gap-2 pt-1 pb-2 ${borderClass}`}>
        <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
          {meal.type}
        </span>
        <div className={`flex items-center rounded-[8px] px-3 py-3 gap-3 ${cardBg}`}>
          <span className="text-[24px] leading-8 shrink-0">{meal.emoji}</span>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {meal.recipeId ? (
              <button
                onClick={() => {
                  const ids = (meal.family ?? FAMILY.map((f) => f.initials)).join(',');
                  const swapParam = isPast ? '' : '&mode=swap';
                  const tonightParam = isToday && meal.type === 'DINNER' ? '&tonight=true' : '';
                  router.push(`/recipe/${meal.recipeId}?family=${ids}&day=${dayName}${swapParam}${tonightParam}`);
                }}
                className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] truncate text-left"
              >
                {meal.name}
              </button>
            ) : (
              <span className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] truncate">
                {meal.name}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
                ⏱️ {meal.cookTime} min
              </span>
              <div className="flex items-center">
                {members.map((a, i) => (
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
            <button aria-label="Edit meal" className="cursor-pointer"><EditIcon /></button>
            <button aria-label="Swap meal" className="cursor-pointer"><SwapIcon /></button>
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
        
      </div>
      <span className={`text-[12px] font-semibold font-picky-sans ${noMealColor} tracking-[0.02em] leading-[1.4] text-right max-w-[40%]`}>
        {noMealLabel}
      </span>
    </div>
  );
}

function WeekdayCardEl({ day }: { day: PlannerDay }) {
  const router = useRouter();
  const cardBg = day.isPast ? 'bg-neutral-tertiary' : 'bg-neutral-primary';
  return (
    <div className={`${cardBg} rounded-[16px] px-4 py-3 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between h-6">
        <button
          onClick={() => router.push(`/planner/${day.id}`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-[16px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
            {day.name}
          </span>
          <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
            {day.date}
          </span>
        </button>
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
            dayName={day.name}
            isToday={day.isToday}
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

  const { weekHeader, pastDays, weekdayDays, weekendDays } = buildWeek();

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
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary cursor-pointer"
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
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary cursor-pointer"
            aria-label="More options"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="4" r="1.25" fill="currentColor" />
              <circle cx="10" cy="10" r="1.25" fill="currentColor" />
              <circle cx="10" cy="16" r="1.25" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Row 2: date range nav */}
        <div className="flex items-center justify-center gap-2 h-[45px] px-4 border-b border-neutral-primary">
          <button className="text-neutral-secondary cursor-pointer" aria-label="Previous week">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[14px] font-semibold font-picky-sans text-neutral-secondary leading-[1.5]">
            {weekHeader}
          </span>
          <button className="text-neutral-secondary cursor-pointer" aria-label="Next week">
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
            {pastDays.map((day) => (
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

          {/* Weekday cards (Mon–Fri from today) */}
          <div className="flex flex-col gap-3">
            {weekdayDays.map((day) => (
              <WeekdayCardEl key={day.id} day={day} />
            ))}
          </div>

          {/* Weekend divider + weekend cards */}
          <WeekendDivider />
          <div className="flex flex-col gap-3">
            {weekendDays.map((day) => (
              <WeekdayCardEl key={day.id} day={day} />
            ))}
          </div>

        </div>
      </div>

      <BottomNav activeTab="planner" />
    </div>
  );
}
