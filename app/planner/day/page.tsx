'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { Avatar } from '@/components/Avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

type AvatarColor = 'purple' | 'blue' | 'orange' | 'green';

type DayMeal = {
  id: string;
  type: string;
  name: string;
  meta: string;
  tags: string[];
  imageSrc: string;
  isPast: boolean;
  showAvatars: boolean;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const TODAY_LABEL = 'Jun 30';
const SESSION_KEY = 'planner_day_past_banner_dismissed';

const FAMILY: { initials: string; color: AvatarColor }[] = [
  { initials: 'S', color: 'purple' },
  { initials: 'D', color: 'blue' },
  { initials: 'M', color: 'orange' },
  { initials: 'N', color: 'green' },
  { initials: 'L', color: 'orange' },
];

const PAST_MEALS: DayMeal[] = [
  {
    id: 'breakfast',
    type: 'Breakfast',
    name: 'Avocado Toast & Poached Eggs',
    meta: '15 min · Serves 2 · ⭐ 4.5 · 320 calories',
    tags: ['🥑 Avocado Season', '🌅 Morning Favorite'],
    imageSrc: 'https://www.figma.com/api/mcp/asset/8a560681-f639-4017-8e23-500d1e5286a5',
    isPast: true,
    showAvatars: true,
  },
];

const FUTURE_MEALS: DayMeal[] = [
  {
    id: 'lunch',
    type: 'Lunch',
    name: 'Hidden Veggie Mac & Cheese',
    meta: '25 min · Serves 3 · ⭐ 4.6 · 620 calories',
    tags: ['🥗 Vegetarian', '📦 Meal Prep'],
    imageSrc: 'https://www.figma.com/api/mcp/asset/12348c07-7e51-4165-ac54-7387193a654c',
    isPast: false,
    showAvatars: false,
  },
  {
    id: 'dinner',
    type: 'Dinner',
    name: 'Honey Garlic Chicken Thighs',
    meta: '35 min · Serves 4 · ⭐ 4.7 · 530 calories',
    tags: ['🥫 Uses Kitchen Items', "👦🏼 Noah's favorite"],
    imageSrc: 'https://www.figma.com/api/mcp/asset/52724427-e886-4cba-9987-b51c41548144',
    isPast: false,
    showAvatars: true,
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftSm() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftLg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightSm() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CaretDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="4.5" r="1.25" fill="currentColor" />
      <circle cx="10" cy="10" r="1.25" fill="currentColor" />
      <circle cx="10" cy="15.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

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
      <path d="M16.667 6.667H3.333m0 0 3.334-3.334m-3.334 3.334 3.334 3.333M3.333 13.333h13.334m0 0-3.334-3.333m3.334 3.333-3.334 3.334"
        stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 2H4a1 1 0 0 0-1 1v10l5-3 5 3V3a1 1 0 0 0-1-1Z"
        stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 1.667l2.575 5.216 5.758.838-4.167 4.059.984 5.737L10 14.833l-5.15 2.684.984-5.737-4.167-4.059 5.758-.838L10 1.667Z"
        stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833"
        stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── MealCard ─────────────────────────────────────────────────────────────────

function MealCard({ meal }: { meal: DayMeal }) {
  const cardBg = meal.isPast ? 'bg-neutral-tertiary' : 'bg-neutral-primary';
  const recipeBg = meal.isPast ? 'bg-neutral-tertiary' : 'bg-white';
  const recipeBorder = meal.isPast ? 'border-neutral-secondary' : 'border-neutral-primary';
  const tagBg = meal.isPast ? 'bg-[rgba(255,255,255,0.75)]' : 'bg-[rgba(236,232,237,0.75)]';
  const tagText = meal.isPast ? 'text-neutral-primary' : 'text-neutral-secondary';

  return (
    <div className={`${cardBg} rounded-[16px] p-4 flex flex-col gap-2 drop-shadow-[0px_4px_7px_rgba(44,2,56,0.15)]`}>
      {/* Card header: meal type + avatars + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
            {meal.type}
          </span>
          {meal.showAvatars && (
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
          )}
        </div>
        <div className="flex items-center gap-3 text-neutral-tertiary">
          <button aria-label="Edit meal"><EditIcon /></button>
          {!meal.isPast && <button aria-label="Swap meal"><SwapIcon /></button>}
        </div>
      </div>

      {/* Inner recipe card */}
      <div className={`border ${recipeBorder} border-solid rounded-[12px] overflow-hidden`}>
        {/* Food photo */}
        <div className="relative h-[160px] w-full shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meal.imageSrc}
            alt={meal.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Bookmark overlay */}
          <button
            aria-label="Bookmark recipe"
            className="absolute top-[10px] right-[12px] bg-[rgba(255,255,255,0.75)] rounded-full p-2 flex items-center justify-center text-neutral-primary"
          >
            <BookmarkIcon />
          </button>
        </div>

        {/* Recipe info */}
        <div className={`${recipeBg} flex flex-col gap-4 p-4`}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[18px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
                {meal.name}
              </span>
              <span className="text-[12px] font-normal font-picky-sans text-neutral-primary leading-[1.4]">
                {meal.meta}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {meal.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`${tagBg} ${tagText} text-[12px] font-normal font-picky-sans leading-[1.4] rounded-full px-2 py-0.5`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          {meal.isPast ? (
            <button className="w-full border border-brand-primary bg-white rounded-[12px] py-2 px-5 flex items-center justify-center gap-2">
              <span className="text-brand-primary flex items-center"><StarIcon /></span>
              <span className="text-[14px] font-semibold font-picky-sans text-brand-primary leading-[1.5]">
                Rate this meal
              </span>
            </button>
          ) : (
            <button className="w-full bg-brand-primary rounded-[12px] py-2 px-5 flex items-center justify-center gap-2">
              <span className="text-[14px] font-semibold font-picky-sans text-brand-inverse leading-[1.5]">
                View Recipe
              </span>
              <span className="text-brand-inverse flex items-center"><ArrowRightIcon /></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlannerDayPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const initialScrollTopRef = useRef<number | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    setBannerDismissed(sessionStorage.getItem(SESSION_KEY) === 'true');
  }, []);

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
        {/* Row 1: back | Today ▼ | kebab */}
        <div className="flex items-center justify-between h-[61px] px-4 border-b border-neutral-primary">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeftLg />
          </button>

          <button className="flex items-center gap-1 text-neutral-primary" aria-label="Select day">
            <span className="text-[18px] font-semibold font-picky-sans leading-[1.5]">Today</span>
            <CaretDownIcon />
          </button>

          <button
            className="flex items-center justify-center size-9 rounded-full text-neutral-secondary cursor-pointer"
            aria-label="More options"
          >
            <KebabIcon />
          </button>
        </div>

        {/* Row 2: date navigation */}
        <div className="flex items-center justify-center gap-2 h-[45px] px-4 border-b border-neutral-primary">
          <button className="text-neutral-secondary" aria-label="Previous day">
            <ChevronLeftSm />
          </button>
          <span className="text-[14px] font-semibold font-picky-sans text-neutral-secondary leading-[1.5]">
            {TODAY_LABEL}
          </span>
          <button className="text-neutral-secondary" aria-label="Next day">
            <ChevronRightSm />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-neutral-disabled"
      >
        <div className="flex flex-col gap-4 px-4 pt-4 pb-[110px]">
          {/* Past meals — scrolled above fold on first load */}
          {PAST_MEALS.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}

          {/* Swipe-up banner between past and future meals */}
          {!bannerDismissed && (
            <div
              ref={bannerRef}
              className="flex items-center justify-center py-2"
            >
              <span className="text-[12px] font-normal font-picky-sans text-neutral-tertiary leading-[1.4]">
                ↑ Swipe Up to View Past Meals
              </span>
            </div>
          )}

          {/* Future meals */}
          {FUTURE_MEALS.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>

      <BottomNav activeTab="planner" />
    </div>
  );
}
