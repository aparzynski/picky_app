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
  const { recipes } = usePickyStore();
  const recipe = recipes[id];

  const isSwapMode = searchParams.get('mode') === 'swap';
  const day = searchParams.get('day') ?? '';
  const familyIds = (searchParams.get('family') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s in FAMILY_INFO);

  const [serves, setServes] = useState(recipe?.serves ?? 4);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [accordionsExpanded, setAccordionsExpanded] = useState<Record<number, boolean>>({});

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

          {/* Planned day + who's eating — only shown in swap mode with family context */}
          {isSwapMode && familyIds.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-brand-quinary px-3 py-1 rounded-full shrink-0">
                <span className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary">
                  🗓️ {day ? `Planned for ${day}` : 'Planned for this Week'}
                </span>
              </div>
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
            </div>
          )}

          {/* Primary CTA — "Swap Meal" when opened from planner, "Add to this Week" otherwise */}
          <Button variant={isSwapMode ? 'secondary' : 'primary'} size="lg" className="w-full">
            {isSwapMode ? 'Swap Meal' : 'Add to this Week'}
          </Button>

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
                <div className={`flex items-center gap-3 ${allInPantry ? '' : 'justify-between'}`}>
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

                  {/* Add to Groceries — hidden when all ingredients are in pantry */}
                  {!allInPantry && (
                    <Button
                      variant="secondary"
                      size="sm"
                      iconLeft={<ShoppingCartIcon />}
                    >
                      Add to Groceries
                    </Button>
                  )}
                </div>

                {/* Ingredient list (Figma 699:8007) */}
                <div className="flex flex-col gap-4">
                  {recipe.ingredients?.map((ingredient, i) => (
                    <RecipeIngredient
                      key={i}
                      name={ingredient.name}
                      state={ingredient.state}
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
    </div>
  );
}
