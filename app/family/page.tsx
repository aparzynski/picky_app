"use client";

import { useRouter } from "next/navigation";
import { usePickyStore } from "@/store/usePickyStore";
import { StatusBar } from "@/components/StatusBar";
import { Avatar } from "@/components/Avatar";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/Button";
import { RecipeCard } from "@/components/RecipeCard";
import { ViewAllButton } from "@/components/ViewAllButton";
import { BottomNav } from "@/components/BottomNav";

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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M8 3.33337V12.6667M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FamilyPage() {
  const router = useRouter();
  const { familyMembers, familyFavoriteIds, recipes } = usePickyStore();

  const familyFavoriteRecipes = familyFavoriteIds
    .map((id) => recipes[id])
    .filter(Boolean);

  return (
    <div className="relative flex flex-col h-dvh overflow-hidden">
      <StatusBar />

      {/* Section Header — My Family */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <h1 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          My Family
        </h1>
        <button className="p-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary">
          <MenuIcon />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-neutral-tertiary p-4 flex flex-col gap-6">

        {/* Family members + Add button */}
        <div className="flex flex-col gap-3">
          {familyMembers.map((member) => {
            const badges = [...member.dislikes, ...member.preferences].slice(0, 2);
            return (
              <div
                key={member.id}
                onClick={() => router.push(`/family/${member.id}`)}
                className="bg-neutral-primary border border-neutral-primary rounded-2xl shadow-[0px_4px_14px_-6px_rgba(44,2,56,0.15)] flex items-center gap-3 px-4 py-[14px] w-full overflow-hidden cursor-pointer"
              >
                <Avatar initials={member.initials} color={member.avatarColor} size={48} />
                <div className="flex-1 min-w-0 flex flex-col gap-1 overflow-hidden">
                  <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-neutral-primary whitespace-nowrap">
                    {member.name}
                  </span>
                  <span className="font-picky-sans font-bold text-[10px] leading-[1.4] text-neutral-secondary tracking-[0.1px] whitespace-nowrap">
                    {member.role} · {member.age}
                  </span>
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-x-[6px] gap-y-0 overflow-hidden">
                      {badges.map((tag) => (
                        <Tag key={tag} label={tag} type="inverse2" />
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 size-9 rounded-full bg-brand-tertiary flex items-center justify-center text-neutral-secondary cursor-pointer hover:bg-brand-secondary transition-colors outline-none"
                >
                  <EditIcon />
                </button>
              </div>
            );
          })}

          <Button
            variant="secondary"
            size="sm"
            pill={true}
            iconLeft={<PlusIcon />}
            className="w-full"
          >
            Add family member
          </Button>
        </div>

        {/* Your Family's Favorites */}
        <div className="flex flex-col w-full">
          <div className="flex items-baseline justify-between w-full">
            <h2 className="font-picky-sans font-semibold text-[18px] leading-[1.5] text-neutral-primary">
              Your Family&apos;s Favorites
            </h2>
            <ViewAllButton label="View More" onClick={() => router.push('/my-recipes')} />
          </div>

          <div className="pt-3 grid grid-cols-2 gap-3 items-start">
            {familyFavoriteRecipes.map((recipe) => (
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

      </div>

      <BottomNav activeTab="family" />
    </div>
  );
}
