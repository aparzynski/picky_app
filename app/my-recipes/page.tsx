'use client';

import { useRouter } from 'next/navigation';
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

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function MyRecipesPage() {
  const router = useRouter();
  const { recipes, savedRecipeIds } = usePickyStore();

  const savedRecipes = savedRecipeIds.map((id) => recipes[id]).filter(Boolean);

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
          My Recipes
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
        <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-secondary px-4 pt-4 pb-2">
          {savedRecipes.length} Recipe{savedRecipes.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-2 gap-3 px-4 items-start">
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              imageUrl={recipe.imageUrl}
              name={recipe.name}
              cookTime={recipe.cookTime}
              tags={recipe.tags}
              saved
            />
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-[104px] right-4 size-14 rounded-full bg-brand-primary flex items-center justify-center shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)] cursor-pointer hover:bg-brand-quarternary transition-colors z-10 outline-none"
        aria-label="Add recipe"
      >
        <PlusIcon />
      </button>

      <BottomNav />
    </div>
  );
}
