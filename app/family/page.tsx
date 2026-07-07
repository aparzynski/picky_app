"use client";

import Image from "next/image";
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
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Section Header — My Family variant */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <h1 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          My Family
        </h1>
        <button className="p-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary">
          <MenuIcon />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-24">

        {/* Family member list */}
        <div className="flex flex-col divide-y divide-neutral-primary">
          {familyMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => router.push(`/family/${member.id}`)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer hover:bg-neutral-secondary transition-colors"
            >
              <Avatar
                initials={member.initials}
                color={member.avatarColor}
                size={48}
              />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary">
                    {member.name}
                  </span>
                  <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
                    {member.role} · {member.age}
                  </span>
                </div>
                {(member.dislikes.length > 0 || member.preferences.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {member.dislikes.slice(0, 2).map((d) => (
                      <Tag key={d} label={d} type="inverse2" />
                    ))}
                    {member.preferences.slice(0, 2).map((p) => (
                      <Tag key={p} label={`❤️ ${p}`} type="inverse2" />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="shrink-0 p-2 rounded-full text-neutral-tertiary cursor-pointer hover:text-brand-primary transition-colors"
              >
                <EditIcon />
              </button>
            </button>
          ))}
        </div>

        {/* Add family member */}
        <div className="px-4 py-4 border-b border-neutral-primary">
          <Button
            variant="secondary"
            size="md"
            pill={false}
            iconLeft={<PlusIcon />}
            className="w-full"
          >
            Add family member
          </Button>
        </div>

        {/* Your Family's Favorites */}
        <div className="flex flex-col pt-4 ">
          <div className="flex items-baseline justify-between px-4 pb-3">
            <h2 className="font-picky-hand font-semibold text-[20px] leading-[1.2] text-neutral-primary">
              Your Family&apos;s Favorites
            </h2>
            <ViewAllButton />
          </div>

          {/* 2-column recipe grid */}
          <div className="grid grid-cols-2 gap-4 items-start px-4 pb-6">
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
