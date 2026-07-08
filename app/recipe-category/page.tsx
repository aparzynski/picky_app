'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePickyStore } from '@/store/usePickyStore';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { RecipeCard } from '@/components/RecipeCard';

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function RecipeCategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recipes, savedRecipeIds } = usePickyStore();

  const title = searchParams.get('title') ?? 'Recipes';
  const ids = (searchParams.get('ids') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const allSaved = searchParams.get('allSaved') === '1';

  const categoryRecipes = ids.map((id) => recipes[id]).filter(Boolean);

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Section Header */}
      <div className="flex items-center justify-between px-4 pb-[13px] pt-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-9 rounded-full text-neutral-primary cursor-pointer hover:bg-neutral-secondary outline-none transition-colors"
          aria-label="Back"
        >
          <ChevronLeftIcon />
        </button>
        <h1 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          {title}
        </h1>
        <button
          className="flex items-center justify-center size-9 rounded-full text-neutral-primary cursor-pointer hover:bg-neutral-secondary outline-none transition-colors"
          aria-label="Filter"
        >
          <FilterIcon />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-neutral-secondary pb-24">
        {/* Recipe count */}
        <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-secondary px-4 pt-4 pb-2">
          {categoryRecipes.length} Recipe{categoryRecipes.length !== 1 ? 's' : ''}
        </p>

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-3 px-4 items-start">
          {categoryRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              imageUrl={recipe.imageUrl}
              name={recipe.name}
              cookTime={recipe.cookTime}
              tags={recipe.tags}
              saved={allSaved || savedRecipeIds.includes(recipe.id)}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function RecipeCategoryPage() {
  return (
    <Suspense fallback={null}>
      <RecipeCategoryContent />
    </Suspense>
  );
}