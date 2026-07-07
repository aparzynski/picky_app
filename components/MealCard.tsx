'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { TransparentOverlayButton } from './TransparentOverlayButton';
import { usePickyStore } from '@/store/usePickyStore';
import { SmallStarRater } from './RatingModal';
import type { Recipe } from '@/store/usePickyStore';
import type { PlannerMeal, MealType } from '@/lib/plannerData';

type AvatarColor = 'purple' | 'blue' | 'orange' | 'green';

const FAMILY: { initials: string; color: AvatarColor }[] = [
  { initials: 'S', color: 'purple' },
  { initials: 'D', color: 'blue' },
  { initials: 'M', color: 'orange' },
  { initials: 'N', color: 'green' },
  { initials: 'L', color: 'orange' },
];
const FAMILY_MAP = Object.fromEntries(FAMILY.map((f) => [f.initials, f]));

const MEAL_LABEL: Record<MealType, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
};

// Shared class for ghost icon buttons (edit, swap in card header)
const iconBtnCls =
  'rounded-full p-1 cursor-pointer transition-colors outline-none ' +
  'text-neutral-tertiary ' +
  'hover:bg-neutral-secondary ' +
  'focus-visible:bg-neutral-secondary focus-visible:ring-2 focus-visible:ring-brand-primary ' +
  'active:bg-neutral-tertiary';

type MealCardProps = {
  meal: PlannerMeal;
  recipe?: Recipe;
  isPast: boolean;
  onViewRecipe?: () => void;
  onSwap?: () => void;
  onRate?: () => void;
};

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.167 2.5a1.768 1.768 0 0 1 2.5 0l.833.833a1.768 1.768 0 0 1 0 2.5L6.25 17.083H2.917v-3.333L14.167 2.5Z"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M2.5 7.5h12.5M12.5 5l2.5 2.5-2.5 2.5M17.5 12.5H5M7.5 10l-2.5 2.5 2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.887 6.163L22 9.27l-5 4.897 1.18 6.905L12 17.77l-6.18 3.302L7 14.167 2 9.27l7.113-1.107L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3.333v9.334M3.333 8h9.334"
        stroke="currentColor"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MealCard({ meal, recipe, isPast, onViewRecipe, onSwap, onRate }: MealCardProps) {
  const { savedRecipeIds, familyFavoriteIds, familyMembers, recipeRatings } = usePickyStore();
  const rating = meal.recipeId ? recipeRatings[meal.recipeId] : undefined;
  const [saved, setSaved] = useState(() =>
    meal.recipeId
      ? savedRecipeIds.includes(meal.recipeId) ||
        familyFavoriteIds.includes(meal.recipeId) ||
        familyMembers.some((m) => m.savedRecipeIds.includes(meal.recipeId!))
      : false,
  );

  if (!meal.hasMeal) {
    if (isPast) {
      return (
        <div className="bg-neutral-secondary rounded-[16px] px-4 py-3 flex items-center gap-3 drop-shadow-[0px_4px_14px_rgba(44,2,56,0.15)]">
          <span className="font-picky-sans font-semibold text-[16px] text-neutral-primary leading-[1.5] flex-1">
            {MEAL_LABEL[meal.type]}
          </span>
          <span className="font-picky-sans font-medium text-[12px] text-neutral-tertiary leading-[1.4] tracking-[0.02em]">
            No Meal Planned
          </span>
          <button className={`${iconBtnCls} shrink-0`} aria-label="Edit meal">
            <EditIcon />
          </button>
        </div>
      );
    } else {
      return (
        <div className="bg-neutral-primary rounded-[16px] px-4 py-3 flex items-center gap-3 drop-shadow-[0px_4px_14px_rgba(44,2,56,0.15)]">
          <span className="font-picky-sans font-semibold text-[16px] text-neutral-primary leading-[1.5] flex-1">
            {MEAL_LABEL[meal.type]}
          </span>
          <Button variant="primary" size="sm" pill={false} iconLeft={<PlusIcon />} className="shrink-0">
            Add Meal
          </Button>
        </div>
      );
    }
  }

  const cardBg = isPast ? 'bg-neutral-tertiary' : 'bg-neutral-primary';
  const innerBg = isPast ? 'bg-neutral-tertiary' : 'bg-neutral-primary';
  const innerBorder = isPast ? 'border-neutral-secondary' : 'border-neutral-primary';
  const tagBg = isPast
    ? 'bg-transparent-neutral-primary'
    : 'bg-transparent-neutral-quarternary';
  const tagText = isPast ? 'text-neutral-primary' : 'text-neutral-secondary';

  const familyAvatars = (meal.family ?? FAMILY.map((f) => f.initials))
    .map((id) => FAMILY_MAP[id])
    .filter(Boolean);

  return (
    <div
      className={`${cardBg} rounded-[16px] p-4 flex flex-col gap-2 drop-shadow-[0px_4px_14px_rgba(44,2,56,0.15)]`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <span className="font-picky-sans font-semibold text-[16px] text-neutral-primary leading-[1.5]">
          {MEAL_LABEL[meal.type]}
        </span>
        {familyAvatars.length > 0 && (
          <div className="flex items-center flex-1">
            {familyAvatars.map((a, i) => (
              <Avatar
                key={i}
                initials={a.initials}
                color={a.color}
                size={16}
                className={`border border-brand-primary shrink-0${i > 0 ? ' -ml-1' : ''}`}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-0 ml-auto shrink-0">
          <button className={iconBtnCls} aria-label="Edit meal">
            <EditIcon />
          </button>
          {!isPast && onSwap && (
            <button onClick={onSwap} className={iconBtnCls} aria-label="Swap meal">
              <SwapIcon />
            </button>
          )}
        </div>
      </div>

      {/* Recipe card panel */}
      {recipe ? (
        <div className={`${innerBg} border ${innerBorder} rounded-[12px] overflow-hidden`}>
          {/* Image */}
          <div className="relative h-[160px]">
            <Image src={recipe.imageUrl} alt={recipe.name} fill className="object-cover" />
            <TransparentOverlayButton
              type="favorite"
              size="medium"
              selected={saved}
              onClick={() => setSaved((v) => !v)}
              className="absolute top-2.5 right-3"
            />
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              {onViewRecipe ? (
                <button
                  onClick={onViewRecipe}
                  className="font-picky-sans font-semibold text-[18px] text-neutral-primary leading-[1.5] text-left cursor-pointer"
                >
                  {recipe.name}
                </button>
              ) : (
                <span className="font-picky-sans font-semibold text-[18px] text-neutral-primary leading-[1.5]">
                  {recipe.name}
                </span>
              )}
              <span className="font-picky-sans font-normal text-[12px] text-neutral-secondary leading-[1.4]">
                {recipe.cookTime} min
                {recipe.serves ? ` · Serves ${recipe.serves}` : ''}
                {recipe.rating ? ` · ⭐ ${recipe.rating}` : ''}
                {recipe.calories ? ` · ${recipe.calories} calories` : ''}
              </span>
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`${tagBg} ${tagText} rounded-full px-2 py-0.5 font-picky-sans font-normal text-[12px] leading-[1.4] whitespace-nowrap`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {isPast ? (
              rating ? (
                <div className="flex items-center justify-center py-2">
                  <SmallStarRater stars={rating} />
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  pill
                  iconLeft={<StarIcon />}
                  className="w-full"
                  onClick={onRate}
                >
                  Rate This Meal
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="md"
                pill={false}
                iconRight={<ArrowRightIcon />}
                onClick={onViewRecipe}
                className="w-full"
              >
                View Recipe
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Fallback — recipe not yet in store */
        <div
          className={`${innerBg} border ${innerBorder} rounded-[12px] p-4 flex items-center gap-3`}
        >
          <span className="text-[32px]">{meal.emoji}</span>
          <div className="flex flex-col gap-1">
            <span className="font-picky-sans font-semibold text-[16px] text-neutral-primary leading-[1.5]">
              {meal.name}
            </span>
            <span className="font-picky-sans font-normal text-[12px] text-neutral-tertiary leading-[1.4]">
              ⏱ {meal.cookTime} min
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
