"use client";

import { useParams, useRouter } from "next/navigation";
import { usePickyStore } from "@/store/usePickyStore";
import { StatusBar } from "@/components/StatusBar";
import { Tag } from "@/components/Tag";
import { RecipeCard } from "@/components/RecipeCard";
import { ViewAllButton } from "@/components/ViewAllButton";
import { BottomNav } from "@/components/BottomNav";

function BackArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M15.8334 10H4.16675M4.16675 10L10.0001 15.8333M4.16675 10L10.0001 4.16667" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M13.3333 2.5C13.5542 2.27908 13.8168 2.10302 14.1059 1.98197C14.3949 1.86093 14.7049 1.79718 15.0183 1.79418C15.3317 1.79118 15.6429 1.84899 15.9342 1.96442C16.2255 2.07984 16.4913 2.25073 16.7163 2.46759C16.9413 2.68444 17.1209 2.9429 17.2447 3.22847C17.3685 3.51403 17.4342 3.82102 17.4379 4.13172C17.4416 4.44243 17.383 4.75091 17.266 5.03933C17.149 5.32776 16.9756 5.59047 16.7558 5.8125L5.83333 16.6667L1.66667 17.5L2.5 13.3333L13.3333 2.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddInlineButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 text-brand-primary font-picky-sans font-semibold text-[12px] leading-[1.4] tracking-[0.24px] cursor-pointer outline-none hover:text-brand-tertiary transition-colors whitespace-nowrap">
      <span>+</span>
      <span>{label}</span>
    </button>
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

  const firstName = member.name.replace(" (You)", "");
  const ageDisplay = /^\d+$/.test(member.age) ? `${member.age} years old` : member.age;

  const favoriteRecipes = member.favoriteRecipeIds.map((rid) => recipes[rid]).filter(Boolean);
  const savedRecipes = member.savedRecipeIds.map((rid) => recipes[rid]).filter(Boolean);

  return (
    <div className="relative flex flex-col h-dvh overflow-hidden">
      <StatusBar />

      {/* Header — back arrow + pencil, no title */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary"
        >
          <BackArrowIcon />
        </button>
        <button className="p-2 -mr-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary">
          <PencilIcon />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-neutral-tertiary p-4 pb-24 flex flex-col gap-4">

        {/* Hero */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center justify-center size-[72px] rounded-full bg-brand-secondary border-2 border-brand-primary shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)] shrink-0 overflow-clip">
            <span className="font-picky-hand font-semibold text-[28px] leading-[1.2] text-brand-primary">
              {member.initials}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <h2 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
              {firstName}
            </h2>
            <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary">
              {member.role} · {ageDisplay}
            </p>
          </div>
        </div>

        {/* Restrictions & Preferences card */}
        <div className="bg-neutral-primary rounded-2xl border border-neutral-primary shadow-[0px_4px_14px_-6px_rgba(44,2,56,0.15)] p-4 flex flex-col gap-2">
          <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-neutral-primary">
            Restrictions &amp; Preferences
          </span>

          {/* Dislikes */}
          <div className="flex flex-col gap-1.5">
            <p className="font-picky-sans font-bold text-[10px] leading-[1.4] text-neutral-secondary tracking-[0.1px]">
              Dislikes
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {member.dislikes.map((d) => <Tag key={d} label={d} type="inverse2" />)}
              <AddInlineButton label="Add dislike" />
            </div>
          </div>

          <div className="h-px bg-[#ece8ed] shrink-0" />

          {/* Allergies */}
          <div className="flex flex-col gap-1.5">
            <p className="font-picky-sans font-bold text-[10px] leading-[1.4] text-neutral-secondary tracking-[0.1px]">
              Allergies
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {member.allergies.map((a) => <Tag key={a} label={a} type="inverse2" />)}
              <AddInlineButton label="Add allergy" />
            </div>
          </div>

          <div className="h-px bg-[#ece8ed] shrink-0" />

          {/* Preferences & diet */}
          <div className="flex flex-col gap-1.5">
            <p className="font-picky-sans font-bold text-[10px] leading-[1.4] text-neutral-secondary tracking-[0.1px]">
              Preferences &amp; diet
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {member.preferences.map((p) => <Tag key={p} label={p} type="inverse2" />)}
              <AddInlineButton label="Add preference" />
            </div>
          </div>

          <div className="h-px bg-[#ece8ed] shrink-0" />

          {/* Goals */}
          <div className="flex flex-col gap-1.5">
            <p className="font-picky-sans font-bold text-[10px] leading-[1.4] text-neutral-secondary tracking-[0.1px]">
              Goals
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {member.goals.map((g) => <Tag key={g} label={g} type="inverse2" />)}
              <AddInlineButton label="Add goal" />
            </div>
          </div>
        </div>

        {/* Earl's Picks for [Name] */}
        {favoriteRecipes.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-picky-sans font-semibold text-[18px] leading-[1.5] text-neutral-primary">
                🧅 Earl&apos;s Picks for {firstName}
              </h2>
              <ViewAllButton
                label="View More"
                onClick={() =>
                  router.push(
                    `/recipe-category?title=${encodeURIComponent(`Earl's Picks for ${firstName}`)}&ids=${member.favoriteRecipeIds.join(",")}&allSaved=1`
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3 items-start">
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

        {/* Saved recipes */}
        {savedRecipes.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-picky-sans font-semibold text-[18px] leading-[1.5] text-neutral-primary">
                {firstName}&apos;s Favorites
              </h2>
              <ViewAllButton label="View More" onClick={() => router.push("/my-recipes")} />
            </div>
            <div className="grid grid-cols-2 gap-3 items-start">
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
