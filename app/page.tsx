"use client";

import { useRouter } from "next/navigation";
import { usePickyStore } from "@/store/usePickyStore";
import { Logo } from "@/components/Logo";
import { NotificationFab } from "@/components/NotificationFab";
import { StatusBar } from "@/components/StatusBar";
import { RecipeHero } from "@/components/RecipeHero";
import { WeekdayCard } from "@/components/WeekdayCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { RecipeCard } from "@/components/RecipeCard";
import { BottomNav } from "@/components/BottomNav";
import { ViewAllButton } from "@/components/ViewAllButton";
import { EarlSaysCard } from "@/components/EarlSaysCard";

export default function Home() {
  const router = useRouter();
  const {
    userName,
    tonightsMeal,
    tonightsMealFamily,
    tonightsMealDay,
    isTonight,
    weekTiles,
    familyFavorites,
    earlNudge,
    groceryItemCount,
    recipesCount,
    expiredItemCount,
  } = usePickyStore();

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">

      {/* Status bar */}
      <StatusBar />

      {/* App header */}
      <div className="flex items-center justify-between px-5 pb-4 shrink-0 bg-neutral-primary">
        <Logo type="mark and word" />
        <NotificationFab alerts count={99} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-24">

        {/* RecipeHero — Tonight's Pick */}
        <RecipeHero
          imageUrl={tonightsMeal.imageUrl}
          title={tonightsMeal.name}
          tags={tonightsMeal.tags}
          isTonight={isTonight}
          onViewRecipe={() => router.push(`/recipe/${tonightsMeal.id}?mode=swap&family=${tonightsMealFamily.join(',')}&day=${tonightsMealDay}&tonight=true`)}
        />

        {/* Greeting */}
        <div className="border-b border-neutral-primary px-5 pt-4 pb-[17px]">
          <h2 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
            Good evening, {userName}! 👋
          </h2>
        </div>

        {/* This Week */}
        <div className="flex flex-col pt-4">
          <div className="flex items-baseline justify-between px-5">
            <h3 className="font-picky-hand font-semibold text-[20px] leading-[1.2] text-neutral-primary">
              This Week
            </h3>
            <ViewAllButton onClick={() => router.push('/planner')} />
          </div>
          {/* TilesWrapper: pt-8 pb-16 wraps the inner tiles row (py-12) — matches Figma nesting */}
         <div className="pt-2 pb-4 overflow-hidden w-full pr-5">
<div className="flex gap-3 items-stretch overflow-x-auto overflow-y-clip pl-5 py-3">
              {weekTiles.map((tile) => (
                <WeekdayCard
                  key={tile.date}
                  dayLabel={tile.dayLabel}
                  emojis={tile.emojis}
                  mealCount={tile.mealCount}
                  currentDay={tile.isToday}
                  onClick={() => router.push(`/planner/${tile.dayLabel.toLowerCase()}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 px-5 pt-2 pb-4">
          <QuickActionCard
            iconSrc="/assets/icon-grocery.svg"
            title="Grocery List"
            subtitle={`${groceryItemCount} items`}
          />
          <QuickActionCard
            iconSrc="/assets/icon-recipes.svg"
            title="My Recipes"
            subtitle={`${recipesCount} items`}
            iconSize={16}
          />
          <QuickActionCard
            iconSrc="/assets/icon-kitchen.svg"
            title="My Kitchen"
            subtitle={`${expiredItemCount} Expired Items`}
          />
        </div>

        {/* Family Favorites — section pt-16, inner pt-16 between header and cards */}
        <div className="flex flex-col pt-4">
          <div className="flex items-baseline justify-between px-5">
            <h3 className="font-picky-hand font-semibold text-[20px] leading-[1.2] text-neutral-primary">
              Your Family Favorites
            </h3>
            <ViewAllButton />
          </div>
          <div className="pt-4 overflow-hidden pr-5 rounded-xl">
            <div className="flex gap-4 items-start overflow-x-auto w-full pb-4 overflow-hidden pl-5 ">
              {familyFavorites.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  imageUrl={recipe.imageUrl}
                  name={recipe.name}
                  cookTime={recipe.cookTime}
                  tags={recipe.tags}
                />
              ))}
            </div>
          </div>
        </div>
{/* Earl Says */}
<div className="px-5 pb-6">
  <EarlSaysCard
    message={earlNudge.message}
    ctaLabel={earlNudge.ctaLabel}
    variant={earlNudge.variant}
  />
</div>
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab="home" />

    </div>
  );
}
