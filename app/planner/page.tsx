'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { Avatar } from '@/components/Avatar';
import { buildWeek, getTodayIdx, DAY_IDS, type MealType, type PlannerMeal, type PlannerDay } from '@/lib/plannerData';
import { usePickyStore } from '@/store/usePickyStore';
import { SwapMealModal } from '@/components/SwapMealModal';
import { PlannerViewDropdown } from '@/components/PlannerViewDropdown';

// ─── Types ───────────────────────────────────────────────────────────────────

type AvatarColor = 'purple' | 'blue' | 'orange' | 'green';

type Meal = PlannerMeal;

// ─── Mock data ────────────────────────────────────────────────────────────────

const FAMILY: { initials: string; color: AvatarColor }[] = [
  { initials: 'S', color: 'purple' },
  { initials: 'D', color: 'blue' },
  { initials: 'M', color: 'orange' },
  { initials: 'N', color: 'green' },
  { initials: 'L', color: 'orange' },
];

const FAMILY_BY_INITIAL = Object.fromEntries(FAMILY.map((f) => [f.initials, f]));

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

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1.667L12.575 6.883L18.333 7.725L14.167 11.783L15.15 17.517L10 14.808L4.85 17.517L5.833 11.783L1.667 7.725L7.425 6.883L10 1.667Z" />
    </svg>
  );
}

function MealRow({ meal, isPast, isLast, dayName, isToday, onSwap }: { meal: Meal; isPast: boolean; isLast: boolean; dayName: string; isToday: boolean; onSwap?: () => void }) {
  const router = useRouter();
  const borderClass = isLast
    ? ''
    : isPast
      ? 'border-b border-neutral-secondary'
      : 'border-b border-neutral-primary';

  if (meal.hasMeal) {
    const members = meal.family
      ? meal.family.map((id) => FAMILY_BY_INITIAL[id]).filter(Boolean)
      : FAMILY;

    if (isPast) {
      return (
        <div className={`flex flex-col gap-2 pt-[4px] pb-[9px] ${borderClass}`}>
          <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
            {meal.type}
          </span>
          <div className="bg-neutral-secondary border border-neutral-secondary rounded-[8px] flex items-center px-[13px] py-[9px] gap-3">
            <span className="text-[30px] leading-9 shrink-0">{meal.emoji}</span>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              {meal.recipeId ? (
                <button
                  onClick={() => {
                    const ids = (meal.family ?? FAMILY.map((f) => f.initials)).join(',');
                    router.push(`/recipe/${meal.recipeId}?family=${ids}&day=${dayName}&meal=${meal.type}&past=true`);
                  }}
                  className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] text-left cursor-pointer break-words"
                >
                  {meal.name}
                </button>
              ) : (
                <span className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] break-words">
                  {meal.name}
                </span>
              )}
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
            <button className="bg-neutral-primary border border-brand-primary text-brand-primary rounded-[8px] px-4 py-2 flex items-center gap-1 font-picky-sans font-semibold text-[12px] leading-[1.4] tracking-[0.02em] cursor-pointer shrink-0">
              <StarIcon />
              Rate This Meal
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col gap-2 pt-[4px] pb-[9px] ${borderClass}`}>
        <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
          {meal.type}
        </span>
        <div className="bg-neutral-primary border border-[#f4f2f5] rounded-[8px] flex items-center px-[13px] py-[9px] gap-3">
          <span className="text-[24px] leading-8 shrink-0">{meal.emoji}</span>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {meal.recipeId ? (
              <button
                onClick={() => {
                  const ids = (meal.family ?? FAMILY.map((f) => f.initials)).join(',');
                  const tonightParam = isToday && meal.type === 'DINNER' ? '&tonight=true' : '';
                  router.push(`/recipe/${meal.recipeId}?family=${ids}&day=${dayName}&meal=${meal.type}&mode=swap${tonightParam}`);
                }}
                className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] text-left cursor-pointer break-words"
              >
                {meal.name}
              </button>
            ) : (
              <span className="text-[14px] font-semibold font-picky-sans text-neutral-primary leading-[1.5] break-words">
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
            <button aria-label="Swap meal" className="cursor-pointer" onClick={onSwap}><SwapIcon /></button>
          </div>
        </div>
      </div>
    );
  }

  // No meal planned
  return (
    <div className={`flex items-center justify-between pt-[8px] pb-[17px] ${borderClass}`}>
      <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
        {meal.type}
      </span>
      {isPast ? (
        <span className="text-[12px] font-medium font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4]">
          No Meal Planned
        </span>
      ) : (
        <span className="text-[12px] font-semibold font-picky-sans text-brand-primary tracking-[0.02em] leading-[1.4]">
          Let me suggest something
        </span>
      )}
    </div>
  );
}

function WeekdayCardEl({ day, onOpenSwap }: { day: PlannerDay; onOpenSwap: (dayName: string, mealType: MealType, familyIds: string[], recipeId: string) => void }) {
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
            onSwap={
              !day.isPast && meal.hasMeal && meal.recipeId
                ? () => onOpenSwap(day.name, meal.type, meal.family ?? FAMILY.map((f) => f.initials), meal.recipeId!)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3 px-0">
      <div className="flex-1 h-px bg-neutral-tertiary" />
      <span className="text-[12px] font-semibold font-picky-sans text-neutral-tertiary tracking-[0.02em] leading-[1.4] uppercase">
        {label}
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

  const plannerMeals = usePickyStore((s) => s.plannerMeals);
  const { weekHeader, pastDays, weekdayDays, weekendDays, nextWeekHeader, nextWeekdayDays, nextWeekendDays } = buildWeek(plannerMeals);

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, 1 = next week
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const todayDayId = DAY_IDS[getTodayIdx()];

  type SwapTarget = { dayName: string; mealType: MealType; familyIds: string[]; recipeId: string };
  const [swapTarget, setSwapTarget] = useState<SwapTarget | null>(null);

  function openSwap(dayName: string, mealType: MealType, familyIds: string[], recipeId: string) {
    setSwapTarget({ dayName, mealType, familyIds, recipeId });
  }

  // Hydrate banner dismissed state from sessionStorage
  useEffect(() => {
    setBannerDismissed(sessionStorage.getItem(SESSION_KEY) === 'true');
  }, []);

  // Scroll to banner position on load / week switch. Resets to top on next week.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      if (weekOffset === 1 || bannerDismissed || !bannerRef.current) {
        scrollRef.current.scrollTop = 0;
        initialScrollTopRef.current = null;
        return;
      }
      const containerRect = scrollRef.current.getBoundingClientRect();
      const bannerRect = bannerRef.current.getBoundingClientRect();
      const targetScrollTop = scrollRef.current.scrollTop + (bannerRect.top - containerRect.top);
      scrollRef.current.scrollTop = targetScrollTop;
      initialScrollTopRef.current = targetScrollTop;
    });
    return () => cancelAnimationFrame(frame);
  }, [bannerDismissed, weekOffset]);

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
      <div className="bg-neutral-primary flex flex-col shrink-0 relative">
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

          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-1 cursor-pointer"
            aria-expanded={dropdownOpen}
          >
            <span className="text-[18px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
              This Week
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={`text-neutral-primary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

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

        {dropdownOpen && (
          <PlannerViewDropdown
            currentView="weekly"
            todayDayId={todayDayId}
            onNavigate={(path) => router.push(path)}
            onClose={() => setDropdownOpen(false)}
          />
        )}

        {/* Row 2: date range nav */}
        <div className="flex items-center justify-center gap-2 h-[45px] px-4 border-b border-neutral-primary">
          <button
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="text-neutral-secondary cursor-pointer disabled:opacity-30"
            aria-label="Previous week"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[14px] font-semibold font-picky-sans text-neutral-secondary leading-[1.5]">
            {weekOffset === 0 ? weekHeader : nextWeekHeader}
          </span>
          <button
            onClick={() => setWeekOffset(1)}
            disabled={weekOffset === 1}
            className="text-neutral-secondary cursor-pointer disabled:opacity-30"
            aria-label="Next week"
          >
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
        <div className="flex flex-col gap-2 px-4 pt-4 pb-[120px]">

          {/* Past days — only on this week view */}
          {weekOffset === 0 && pastDays.length > 0 && (
            <div className="flex flex-col gap-3">
              {pastDays.map((day) => (
                <WeekdayCardEl key={day.id} day={day} onOpenSwap={openSwap} />
              ))}
            </div>
          )}

          {/* Past Days Banner */}
          {weekOffset === 0 && !bannerDismissed && pastDays.length > 0 && (
            <div ref={bannerRef} className="flex items-center justify-center py-2">
              <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
                ↑ Swipe Up to View Past Days
              </span>
            </div>
          )}

          {/* Weekday cards */}
          <div className="flex flex-col gap-3">
            {(weekOffset === 0 ? weekdayDays : nextWeekdayDays).map((day) => (
              <WeekdayCardEl key={day.id} day={day} onOpenSwap={openSwap} />
            ))}
          </div>

          {/* Weekend divider + weekend cards */}
          <SectionDivider label="Weekend" />
          <div className="flex flex-col gap-3">
            {(weekOffset === 0 ? weekendDays : nextWeekendDays).map((day) => (
              <WeekdayCardEl key={day.id} day={day} onOpenSwap={openSwap} />
            ))}
          </div>

        </div>
      </div>

      <BottomNav activeTab="planner" />

      {swapTarget && (
        <SwapMealModal
          dayName={swapTarget.dayName}
          mealType={swapTarget.mealType}
          familyIds={swapTarget.familyIds}
          currentRecipeId={swapTarget.recipeId}
          onClose={() => setSwapTarget(null)}
        />
      )}
    </div>
  );
}
