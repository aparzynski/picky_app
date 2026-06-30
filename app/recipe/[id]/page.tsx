'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePickyStore } from '@/store/usePickyStore';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { RecipeHero } from '@/components/RecipeHero';
import { Button } from '@/components/Button';
import { RecipeAccordion } from '@/components/RecipeAccordion';
import { RecipeIngredient } from '@/components/RecipeIngredient';
import { Tab } from '@/components/Tab';
import { TransparentOverlayButton } from '@/components/TransparentOverlayButton';

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
  const { recipes } = usePickyStore();
  const recipe = recipes[id];

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

          {/* Add to this Week — Button Type=Primary Size=Large (full width) */}
          <Button variant="primary" size="lg" className="w-full">
            Add to this Week
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
                {recipe.instructions?.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    {/* Step number — Body/Small/Strong (14px SemiBold) */}
                    <span className="font-picky-sans font-semibold text-[14px] leading-[1.4] text-brand-primary min-w-[20px] text-center shrink-0">
                      {i + 1}
                    </span>
                    {/* Step text — Body/Regular/Base (16px Regular) */}
                    <p className="font-picky-sans font-normal text-[16px] leading-[1.4] text-neutral-primary">
                      {step}
                    </p>
                  </div>
                ))}
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
