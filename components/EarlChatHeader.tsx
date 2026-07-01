'use client';

// Figma: Earl Chat Header (solo, 548:4614)
// 432×64.8px white header — back chevron | Earl avatar + name/subtitle | search + menu

import { EarlAvatar } from './EarlAvatar';

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

type EarlChatHeaderProps = {
  onBack?: () => void;
  onSearch?: () => void;
  onMenu?: () => void;
};

export function EarlChatHeader({ onBack, onSearch, onMenu }: EarlChatHeaderProps) {
  return (
    <header className="flex items-center justify-between h-[65px] px-4 bg-neutral-primary border-b border-neutral-primary shrink-0">
      {/* Left: back + Earl identity */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full text-neutral-primary shrink-0 hover:bg-neutral-secondary focus-visible:bg-neutral-secondary outline-none"
          aria-label="Go back"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <EarlAvatar />
          <div className="flex flex-col min-w-0">
            <span className="font-picky-sans font-semibold text-[14px] leading-[1.3] text-neutral-primary truncate">
              Earl
            </span>
            <span className="font-picky-sans font-normal text-[12px] leading-[1.3] text-neutral-secondary truncate">
              Your family's meal assistant.
            </span>
          </div>
        </div>
      </div>

      {/* Right: search + menu */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSearch}
          className="flex items-center justify-center w-9 h-9 rounded-full text-neutral-primary hover:bg-neutral-secondary focus-visible:bg-neutral-secondary outline-none"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
        <button
          onClick={onMenu}
          className="flex items-center justify-center w-9 h-9 rounded-full text-neutral-primary hover:bg-neutral-secondary focus-visible:bg-neutral-secondary outline-none"
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
