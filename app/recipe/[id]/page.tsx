'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { usePickyStore } from '@/store/usePickyStore';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { RecipeHero } from '@/components/RecipeHero';
import { Button } from '@/components/Button';
import { RecipeAccordion } from '@/components/RecipeAccordion';
import { RecipeIngredient } from '@/components/RecipeIngredient';
import { Tab } from '@/components/Tab';
import { TransparentOverlayButton } from '@/components/TransparentOverlayButton';
import { SwapMealModal } from '@/components/SwapMealModal';
import { SmallStarRater } from '@/components/RatingModal';
import { MealRatingModal } from '@/components/MealRatingModal';
const FAMILY_INFO: Record<string, { name: string; initials: string }> = {
  S: { name: 'Sarah', initials: 'S' },
  D: { name: 'David', initials: 'D' },
  M: { name: 'Mia',   initials: 'M' },
  N: { name: 'Noah',  initials: 'N' },
  L: { name: 'Lily',  initials: 'L' },
};

const EATING_AVATAR_STYLES: Record<string, { bg: string; text: string }> = {
  S: { bg: 'bg-purple-10',      text: 'text-purple-80' },
  D: { bg: 'bg-blue-10',        text: 'text-blue-80' },
  M: { bg: 'bg-orange-10',      text: 'text-orange-70' },
  N: { bg: 'bg-green-10',       text: 'text-green-80' },
  L: { bg: 'bg-brand-secondary', text: 'text-purple-80' },
};

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

function ShoppingCartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0">
      <path
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recipes, savedRecipeIds, familyFavoriteIds, familyMembers, recipeRatings } = usePickyStore();
  const recipe = recipes[id];

  const isSwapMode = searchParams.get('mode') === 'swap';
  const isPastMeal = searchParams.get('past') === 'true';
  const isTonight = searchParams.get('tonight') === 'true';
  const isNextWeek = searchParams.get('nextWeek') === '1';
  const day = searchParams.get('day') ?? '';
  const mealType = searchParams.get('meal') ?? '';
  const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  const isToday = !isNextWeek && day !== '' && day === todayName;

  // For next-week planned meals, compute the real calendar date ("July 8th")
  const plannedDateLabel = (() => {
    if (!isNextWeek || !day) return null;
    const DAY_NAME_TO_IDX: Record<string, number> = {
      Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
    };
    const dayOffset = DAY_NAME_TO_IDX[day];
    if (dayOffset === undefined) return null;
    const today = new Date();
    const dow = today.getDay();
    const todayIdx = dow === 0 ? 6 : dow - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - todayIdx + 7); // next Monday
    monday.setHours(0, 0, 0, 0);
    const d = new Date(monday);
    d.setDate(monday.getDate() + dayOffset);
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const n = d.getDate();
    const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th','st','nd','rd'][n % 10] ?? 'th';
    return `${month} ${n}${suffix}`;
  })();
  const familyIds = (searchParams.get('family') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s in FAMILY_INFO);

  const [serves, setServes] = useState(recipe?.serves ?? 4);
  const [saved, setSaved] = useState(() =>
    savedRecipeIds.includes(id) ||
    familyFavoriteIds.includes(id) ||
    familyMembers.some((m) => m.savedRecipeIds.includes(id))
  );
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [accordionsExpanded, setAccordionsExpanded] = useState<Record<number, boolean>>({});
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [groceriesAdded, setGroceriesAdded] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const recipeRating = recipeRatings[id];

  const allInPantry = recipe?.ingredients?.every((i) => i.state === 'in pantry') ?? false;

  if (!recipe) {
    return (
      <div className="flex flex-col h-dvh bg-neutral-primary items-center justify-center gap-4">
        <p className="font-picky-sans font-normal text-[16px] leading-[1.4] text-neutral-tertiary">
          Recipe not found
        </p>
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const subtitle = [
    `${recipe.cookTime} min`,
    `Serves ${serves}`,
    recipe.rating ? `⭐ ${recipe.rating}` : null,
    recipe.calories ? `${recipe.calories} cal` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-24">
        {/* Recipe Hero — destination=recipe (Figma 658:17753) */}
        <RecipeHero
          destination="recipe"
          imageUrl={recipe.imageUrl}
          title={recipe.name}
          tags={recipe.tags}
          subtitle={subtitle}
          saved={saved}
          onBack={() => router.back()}
          onBookmark={() => setSaved((v) => !v)}
        />

        {/* Body content — px-5 py-5 = Numbers/L all sides */}
        <div className="flex flex-col gap-5 px-5 py-5">
          {/* Description — Body/Regular/Base (16px Regular) */}
          <p className="font-picky-sans font-normal text-[16px] leading-[1.4] text-neutral-secondary">
            {recipe.description}
          </p>

          {/* Planned day + who's eating */}
          {(isSwapMode || isPastMeal) && familyIds.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-brand-quinary px-3 py-1 rounded-full shrink-0">
                <span className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary">
                  {isPastMeal
                    ? day
                      ? `🗓️ ${day}'s ${mealType.charAt(0) + mealType.slice(1).toLowerCase()}`
                      : '🗓️ Past Meal'
                    : isTonight || (isToday && mealType === 'DINNER')
                    ? "🌙 Tonight's Dinner"
                    : isToday && mealType === 'BREAKFAST'
                    ? "🌅 Today's Breakfast"
                    : isToday && mealType === 'LUNCH'
                    ? "☀️ Today's Lunch"
                    : plannedDateLabel
                    ? `🗓️ Planned for ${plannedDateLabel}`
                    : day
                    ? `🗓️ Planned for ${day}`
                    : '🗓️ Planned for this Week'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {familyIds.map((fid, i) => {
                    const style = EATING_AVATAR_STYLES[fid];
                    if (!style) return null;
                    const isLast = i === familyIds.length - 1;
                    return (
                      <div
                        key={fid}
                        className={`${style.bg} border border-brand-primary flex items-center justify-center overflow-clip rounded-full shrink-0 size-6 ${isLast ? '' : '-mr-2.5'}`}
                      >
                        <span className={`font-picky-hand font-bold text-[10px] leading-[1.4] tracking-[0.1px] ${style.text}`}>
                          {fid}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {isPastMeal && recipeRating && (
                  <SmallStarRater stars={recipeRating} />
                )}
              </div>
            </div>
          )}

          {/* Primary CTA */}
          {!(isPastMeal && recipeRating) && (
            <Button
              variant={isPastMeal ? 'secondary' : isSwapMode ? 'secondary' : 'primary'}
              size="lg"
              className="w-full"
              iconLeft={isPastMeal ? <StarIcon /> : undefined}
              onClick={
                isPastMeal ? () => setRatingModalOpen(true)
                : isSwapMode ? () => setSwapModalOpen(true)
                : undefined
              }
            >
              {isPastMeal ? 'Rate This Meal' : isSwapMode ? 'Swap Meal' : 'Add to this Week'}
            </Button>
          )}

          {/* Recipe Accordions (Figma 675:7439) */}
          {recipe.accordions?.map((acc, i) => (
            <RecipeAccordion
              key={i}
              color={acc.color}
              expanded={accordionsExpanded[i] ?? true}
              title={acc.title}
              body={acc.body}
              ctaLabel={acc.ctaLabel}
              onCtaClick={() => {}}
            />
          ))}
        </div>

        {/* Tab section */}
        <div className="flex flex-col">
          {/* Tab bar — border-b + pb-px so selected tab's border-b-2 overlays the separator */}
          <div className="flex items-start border-b border-neutral-primary pb-px px-5">
            <Tab
              label="Ingredients"
              selected={activeTab === 'ingredients'}
              onClick={() => setActiveTab('ingredients')}
            />
            <Tab
              label="Instructions"
              selected={activeTab === 'instructions'}
              onClick={() => setActiveTab('instructions')}
            />
          </div>

          {/* Tab content — px-5 py-5 */}
          <div className="px-5 py-5">
            {activeTab === 'ingredients' && (
              <div className="flex flex-col gap-5">
                {/* Serves stepper row */}
                <div className={`flex items-center gap-3 ${allInPantry && !groceriesAdded ? '' : 'justify-between'}`}>
                  {/* Serves stepper pill */}
                  <div className="flex items-center gap-3 px-2 py-1 bg-neutral-secondary rounded-full">
                    <TransparentOverlayButton
                      type="minus"
                      size="medium"
                      onClick={() => setServes((v) => Math.max(1, v - 1))}
                    />
                    <span className="font-picky-sans font-normal text-[14px] leading-[1.4] text-neutral-primary min-w-[60px] text-center">
                      Serves {serves}
                    </span>
                    <TransparentOverlayButton
                      type="add"
                      size="medium"
                      onClick={() => setServes((v) => v + 1)}
                    />
                  </div>

                  {!allInPantry && (
                    groceriesAdded ? (
                      <div className="bg-[#d4fdd0] rounded-full px-4 py-2 shrink-0">
                        <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-success-primary whitespace-nowrap">
                          Added to grocery list
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        iconLeft={<ShoppingCartIcon />}
                        onClick={() => setGroceriesAdded(true)}
                      >
                        Add to Groceries
                      </Button>
                    )
                  )}
                </div>

                {/* Ingredient list (Figma 699:8007) */}
                <div className="flex flex-col gap-4">
                  {recipe.ingredients?.map((ingredient, i) => (
                    <RecipeIngredient
                      key={i}
                      name={ingredient.name}
                      state={
                        groceriesAdded && ingredient.state === 'missing item'
                          ? 'added to grocery list'
                          : ingredient.state
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="flex flex-col gap-5">
                {(() => {
                  const steps = recipe.instructions ?? [];
                  const n = steps.length;
                  const stepTimes: number[] = (() => {
                    if (n === 0) return [];
                    if (n === 1) return [recipe.cookTime];
                    const mid = (n - 1) / 2;
                    const weights = steps.map((_, i) => 1 + (1 - Math.abs(i - mid) / mid));
                    const totalWeight = weights.reduce((s, w) => s + w, 0);
                    const rounded = weights.map(w => Math.max(1, Math.round((w / totalWeight) * recipe.cookTime)));
                    const diff = recipe.cookTime - rounded.reduce((s, t) => s + t, 0);
                    if (diff !== 0) rounded[rounded.indexOf(Math.max(...rounded))] += diff;
                    return rounded;
                  })();
                  return steps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      {/* Step number — purple circle */}
                      <div className="bg-brand-primary flex items-center justify-center rounded-full shrink-0 size-6">
                        <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-inverse">
                          {i + 1}
                        </span>
                      </div>
                      {/* Step content */}
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-primary">
                          {step}
                        </p>
                        <div className="flex items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-brand-primary">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round"/>
                            <path d="M8 5.333V8l1.667 1.667" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary">
                            {stepTimes[i]} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="h-6" />
      </div>

      <BottomNav />

      {swapModalOpen && (
        <SwapMealModal
          dayName={day}
          mealType={(mealType || 'DINNER') as 'BREAKFAST' | 'LUNCH' | 'DINNER'}
          familyIds={familyIds}
          currentRecipeId={id}
          onClose={() => setSwapModalOpen(false)}
        />
      )}

      {ratingModalOpen && (
        <MealRatingModal
          recipeId={id}
          dayName={day}
          mealType={mealType}
          onClose={() => setRatingModalOpen(false)}
        />
      )}
    </div>
  );
}
