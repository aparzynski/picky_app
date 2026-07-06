"use client";

import { useEffect, useRef, useState } from "react";
import { usePickyStore } from "@/store/usePickyStore";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "@/components/BottomNav";
import { DiscoverCategorySection } from "@/components/DiscoverCategorySection";

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M8 12H16M11 18H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DiscoverPage() {
  const { discoverCategories, recipes, savedRecipeIds } = usePickyStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Section Header — Discover variant (555:6495) */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <h1 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          Discover
        </h1>
        <div className="flex items-center">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className={`p-2 rounded-full cursor-pointer outline-none transition-colors focus-visible:text-brand-primary ${
              searchOpen
                ? "text-brand-primary"
                : "text-neutral-primary hover:text-brand-primary"
            }`}
          >
            <SearchIcon />
          </button>
          <button className="p-2 rounded-full text-neutral-primary cursor-pointer outline-none transition-colors hover:text-brand-primary focus-visible:text-brand-primary">
            <FilterIcon />
          </button>
        </div>
      </div>

      {/* Search bar — SearchContainer (561:9533) */}
      {searchOpen && (
        <div className="px-4 py-4 bg-neutral-primary border-b border-neutral-primary shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-neutral-tertiary">
            <div className="shrink-0 size-5 flex items-center justify-center text-neutral-tertiary">
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search recipes..."
              className="flex-1 min-w-0 bg-transparent font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-primary placeholder:text-neutral-tertiary outline-none"
            />
          </div>
        </div>
      )}

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-neutral-secondary overflow-x-hidden pb-24">

        {/* Discover categories (658:15791–658:15795) */}
        {discoverCategories.map((category) => (
          <DiscoverCategorySection
            key={category.id}
            title={category.title}
            recipes={category.recipeIds.map((id) => recipes[id]).filter(Boolean)}
            savedRecipeIds={savedRecipeIds}
          />
        ))}

        <div className="h-6" />
      </div>

      <BottomNav activeTab="discover" />
    </div>
  );
}
