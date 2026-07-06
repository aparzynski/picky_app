"use client";

import { useParams, useRouter } from "next/navigation";
import { usePickyStore } from "@/store/usePickyStore";
import { StatusBar } from "@/components/StatusBar";
import { Avatar } from "@/components/Avatar";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/Button";
import { RecipeCard } from "@/components/RecipeCard";
import { BottomNav } from "@/components/BottomNav";

function BackArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M3.33337 5H16.6667M3.33337 10H16.6667M3.33337 15H16.6667" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4.66663 4.66663H3.99996C3.64634 4.66663 3.3072 4.8071 3.05715 5.05715C2.8071 5.3072 2.66663 5.64634 2.66663 5.99996V12C2.66663 12.3536 2.8071 12.6927 3.05715 12.9428C3.3072 13.1928 3.64634 13.3333 3.99996 13.3333H9.99996C10.3536 13.3333 10.6927 13.1928 10.9428 12.9428C11.1928 12.6927 11.3333 12.3536 11.3333 12V11.3333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6667 3.33328L12.6667 5.33328M13.59 4.38995C13.8526 4.12739 14.0001 3.77127 14.0001 3.39995C14.0001 3.02863 13.8526 2.67251 13.59 2.40995C13.3274 2.14738 12.9713 1.99988 12.6 1.99988C12.2287 1.99988 11.8726 2.14738 11.61 2.40995L6 7.99995V9.99995H8L13.59 4.38995Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FamilyMemberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { familyMembers, recipes } = usePickyStore();

  const member = familyMembers.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="flex flex-col h-dvh bg-neutral-primary items-center justify-center">
        <p className="text-neutral-tertiary font-picky-sans text-[14px]">Member not found.</p>
      </div>
    );
  }

  const favoriteRecipes = member.favoriteRecipeIds.map((rid) => recipes[rid]).filter(Boolean);
  const savedRecipes = member.savedRecipeIds.map((rid) => recipes[rid]).filter(Boolean);

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Section Header — profile variant (back arrow + member name + menu) */}
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary"
        >
          <BackArrowIcon />
        </button>
        <h1 className="flex-1 font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          {member.name.replace(" (You)", "")}
        </h1>
        <button className="p-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary">
          <MenuIcon />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-24">

        {/* Hero — 72px bordered avatar + name + role·age */}
        <div className="flex flex-col items-center gap-3 px-4 py-6 border-b border-neutral-primary">
          {/* Bespoke 72px avatar — bg-brand-secondary, border-2 brand-primary */}
          <div className="flex items-center justify-center size-[72px] rounded-full bg-brand-secondary border-2 border-brand-primary shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)] shrink-0">
            <span className="font-picky-hand font-semibold text-[28px] leading-[1.2] text-brand-primary">
              {member.initials}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <h2 className="font-picky-hand font-semibold text-[20px] leading-[1.2] text-neutral-primary">
              {member.name.replace(" (You)", "")}
            </h2>
            <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary">
              {member.role} · {member.age}
            </p>
          </div>
        </div>

        {/* Restrictions & Preferences card */}
        <div className="mx-4 my-4 rounded-[var(--l,16px)] border border-neutral-primary bg-neutral-primary shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">

          {/* Dislikes section */}
          {member.dislikes.length > 0 && (
            <div className="px-4 py-3 border-b border-neutral-primary">
              <div className="flex items-center justify-between mb-2">
                <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary">
                  Dislikes
                </span>
                <button className="p-1 rounded-full text-neutral-tertiary cursor-pointer hover:text-brand-primary transition-colors">
                  <EditIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.dislikes.map((d) => (
                  <Tag key={d} label={d} type="inverse2" />
                ))}
              </div>
            </div>
          )}

          {/* Preferences section */}
          {member.preferences.length > 0 && (
            <div className="px-4 py-3 border-b border-neutral-primary">
              <div className="flex items-center justify-between mb-2">
                <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary">
                  Preferences
                </span>
                <button className="p-1 rounded-full text-neutral-tertiary cursor-pointer hover:text-brand-primary transition-colors">
                  <EditIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.preferences.map((p) => (
                  <Tag key={p} label={p} type="inverse2" />
                ))}
              </div>
            </div>
          )}

          {/* Goals section */}
          {member.goals.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary">
                  Goals
                </span>
                <button className="p-1 rounded-full text-neutral-tertiary cursor-pointer hover:text-brand-primary transition-colors">
                  <EditIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.goals.map((g) => (
                  <Tag key={g} label={g} type="inverse2" />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {member.dislikes.length === 0 && member.preferences.length === 0 && member.goals.length === 0 && (
            <div className="px-4 py-6 flex flex-col items-center gap-2">
              <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary text-center">
                No preferences set yet.
              </p>
              <Button variant="secondary" size="sm" pill>
                Add preferences
              </Button>
            </div>
          )}
        </div>

        {/* Favorites recipe grid */}
        {favoriteRecipes.length > 0 && (
          <div className="flex flex-col pt-2">
            <div className="flex items-baseline justify-between px-4 pb-3">
              <h2 className="font-picky-hand font-semibold text-[20px] leading-[1.2] text-neutral-primary">
                Earl&apos;s Picks
              </h2>
              <button className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary cursor-pointer hover:text-brand-secondary transition-colors whitespace-nowrap">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              {favoriteRecipes.map((recipe) => (
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
        )}

        {/* Saved recipe grid */}
        {savedRecipes.length > 0 && (
          <div className="flex flex-col pt-2">
            <div className="flex items-baseline justify-between px-4 pb-3">
              <h2 className="font-picky-hand font-semibold text-[20px] leading-[1.2] text-neutral-primary">
                Saved
              </h2>
              <button className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary cursor-pointer hover:text-brand-secondary transition-colors whitespace-nowrap">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 pb-6">
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
        )}

      </div>

      <BottomNav activeTab="family" />
    </div>
  );
}
