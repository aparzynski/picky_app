'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { MealCard } from '@/components/MealCard';
import { PlannerViewDropdown } from '@/components/PlannerViewDropdown';
import { SwapMealModal } from '@/components/SwapMealModal';
import { RatingModal } from '@/components/RatingModal';
import { usePickyStore } from '@/store/usePickyStore';
import {
  DAY_IDS,
  DAY_NAMES,
  getTodayIdx,
  getDayIdByIdx,
  getDayIdxById,
  type MealType,
} from '@/lib/plannerData';

const SESSION_KEY_PREFIX = 'planner_day_banner_';

function isMealPastForToday(type: MealType): boolean {
  const hour = new Date().getHours();
  if (type === 'BREAKFAST') return hour >= 11;
  if (type === 'LUNCH') return hour >= 15;
  return false;
}

export default function PlannerDayPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const initialScrollTopRef = useRef<number | null>(null);

  const { plannerMeals, recipes } = usePickyStore();

  const dayIdx = getDayIdxById(dayId);
  const todayIdx = getTodayIdx();
  const isToday = dayIdx === todayIdx;
  const isPastDay = dayIdx < todayIdx;

  const dayName = DAY_NAMES[dayIdx % 7] ?? dayId;

  // Compute the calendar date for this day
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIdx);
  monday.setHours(0, 0, 0, 0);
  const dayDate = new Date(monday);
  dayDate.setDate(monday.getDate() + dayIdx);
  const dateLabel = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const meals = plannerMeals[dayIdx] ?? [];

  const pastMeals = meals.filter((m) => {
    if (isPastDay) return true;
    if (isToday) return isMealPastForToday(m.type);
    return false;
  });
  const currentMeals = meals.filter((m) => {
    if (isPastDay) return false;
    if (isToday) return !isMealPastForToday(m.type);
    return true;
  });

  const hasPastMeals = pastMeals.length > 0;
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  type SwapTarget = { mealType: MealType; familyIds: string[]; recipeId: string };
  const [swapTarget, setSwapTarget] = useState<SwapTarget | null>(null);
  type RatingTarget = { recipeId: string; recipeName: string; familyIds: string[] };
  const [ratingTarget, setRatingTarget] = useState<RatingTarget | null>(null);
  const todayDayId = DAY_IDS[todayIdx];

  const sessionKey = SESSION_KEY_PREFIX + dayId;

  useEffect(() => {
    setBannerDismissed(sessionStorage.getItem(sessionKey) === 'true');
  }, [sessionKey]);

  // Scroll to show current meals on load — past meals above the fold
  useEffect(() => {
    if (bannerDismissed || !hasPastMeals) return;
    const frame = requestAnimationFrame(() => {
      if (scrollRef.current && bannerRef.current) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const bannerRect = bannerRef.current.getBoundingClientRect();
        const target =
          scrollRef.current.scrollTop + (bannerRect.top - containerRect.top);
        scrollRef.current.scrollTop = target;
        initialScrollTopRef.current = target;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [bannerDismissed, hasPastMeals]);

  function handleScroll() {
    if (bannerDismissed || initialScrollTopRef.current === null || !scrollRef.current) return;
    if (scrollRef.current.scrollTop < initialScrollTopRef.current - 20) {
      setBannerDismissed(true);
      sessionStorage.setItem(sessionKey, 'true');
    }
  }

  const prevDayId = getDayIdByIdx(dayIdx - 1);
  const nextDayId = getDayIdByIdx(dayIdx + 1);

  if (dayIdx === -1) {
    return (
      <div className="flex flex-col h-dvh bg-neutral-primary items-center justify-center">
        <p className="font-picky-sans text-[14px] text-neutral-tertiary">Day not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Header */}
      <div className="bg-neutral-primary flex flex-col shrink-0 relative">
        {/* Row 1: back · title + caret · menu */}
        <div className="flex items-center justify-between h-[61px] px-4 border-b border-neutral-primary">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary cursor-pointer"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-1 cursor-pointer"
            aria-expanded={dropdownOpen}
          >
            <span className="font-picky-sans font-semibold text-[18px] text-neutral-primary leading-[1.5]">
              {isToday ? 'Today' : dayName}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={`text-neutral-primary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
            currentView="day"
            todayDayId={todayDayId}
            onNavigate={(path) => router.push(path)}
            onClose={() => setDropdownOpen(false)}
          />
        )}

        {/* Row 2: date prev/next navigation */}
        <div className="flex items-center justify-center gap-2 h-[46px] px-4 border-b border-neutral-primary">
          <button
            onClick={() => prevDayId && router.push(`/planner/${prevDayId}`)}
            disabled={!prevDayId}
            className="text-neutral-secondary cursor-pointer disabled:opacity-30"
            aria-label="Previous day"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="font-picky-sans font-semibold text-[14px] text-neutral-secondary leading-[1.5]">
            {dateLabel}
          </span>
          <button
            onClick={() => nextDayId && router.push(`/planner/${nextDayId}`)}
            disabled={!nextDayId}
            className="text-neutral-secondary cursor-pointer disabled:opacity-30"
            aria-label="Next day"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
        <div className="flex flex-col gap-4 px-4 pt-4 pb-[120px]">

          {/* Past meals — above the fold on initial load */}
          {pastMeals.map((meal) => (
            <MealCard
              key={meal.type}
              meal={meal}
              recipe={meal.recipeId ? recipes[meal.recipeId] : undefined}
              isPast
              onViewRecipe={
                meal.recipeId
                  ? () => router.push(`/recipe/${meal.recipeId}?day=${dayName}&meal=${meal.type}&family=${(meal.family ?? []).join(',')}&past=true`)
                  : undefined
              }
            />
          ))}

          {/* Separator banner */}
          {hasPastMeals && !bannerDismissed && (
            <div ref={bannerRef} className="flex items-center justify-center py-1">
              <span className="font-picky-sans font-normal text-[12px] text-neutral-tertiary leading-[1.4]">
                ↑ Swipe Up to View Past Meals
              </span>
            </div>
          )}

          {/* Current / future meals */}
          {currentMeals.map((meal) => (
            <MealCard
              key={meal.type}
              meal={meal}
              recipe={meal.recipeId ? recipes[meal.recipeId] : undefined}
              isPast={false}
              onViewRecipe={
                meal.recipeId
                  ? () => {
                      const family = (meal.family ?? []).join(',');
                      const tonight = isToday && meal.type === 'DINNER' ? '&tonight=true' : '';
                      router.push(`/recipe/${meal.recipeId}?family=${family}&day=${dayName}&meal=${meal.type}&mode=swap${tonight}`);
                    }
                  : undefined
              }
              onSwap={
                meal.recipeId
                  ? () => setSwapTarget({
                      mealType: meal.type,
                      familyIds: meal.family ?? [],
                      recipeId: meal.recipeId!,
                    })
                  : undefined
              }
            />
          ))}


        </div>
      </div>

      <BottomNav activeTab="planner" />

      {swapTarget && (
        <SwapMealModal
          dayName={dayName}
          mealType={swapTarget.mealType}
          familyIds={swapTarget.familyIds}
          currentRecipeId={swapTarget.recipeId}
          onClose={() => setSwapTarget(null)}
        />
      )}
    </div>
  );
}
