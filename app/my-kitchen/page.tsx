"use client";

import { useState } from 'react';
import { usePickyStore } from '@/store/usePickyStore';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { Tab } from '@/components/Tab';
import { Button } from '@/components/Button';
import { EarlSaysCard } from '@/components/EarlSaysCard';
import { InventoryCategorySection } from '@/components/InventoryCategorySection';

type KitchenTab = 'fridge' | 'freezer' | 'pantry';

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
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

function PlusSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 2v10M2 7h10" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" aria-hidden="true">
      <circle cx="2" cy="2"  r="1.5" fill="currentColor" />
      <circle cx="2" cy="8"  r="1.5" fill="currentColor" />
      <circle cx="2" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CameraPlusIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8l-2.5 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2h-7.5L28 8H16Z" />
      <circle cx="22" cy="22" r="6" />
      <path d="M34 10v6M31 13h6" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MyKitchenPage() {
  const { kitchenItems } = usePickyStore();
  const [activeTab, setActiveTab] = useState<KitchenTab>('fridge');
  const [earlDismissed, setEarlDismissed] = useState(false);

  // ── Fridge groupings ──────────────────────────────────────────────────────
  const fridgeItems = kitchenItems.filter((i) => i.location === 'fridge');
  const fridgeProduce = fridgeItems.filter((i) => i.category === 'produce');
  const fridgeProtein = fridgeItems.filter((i) => i.category === 'protein');
  const fridgeDairy = fridgeItems.filter((i) => i.category === 'dairy');
  const expiringCount = fridgeItems.filter((i) => i.expiry?.type === 'danger').length;

  // ── Freezer groupings ─────────────────────────────────────────────────────
  const freezerItems = kitchenItems.filter((i) => i.location === 'freezer');
  const freezerMeals = freezerItems.filter((i) => i.category === 'frozen meals');
  const freezerProtein = freezerItems.filter((i) => i.category === 'protein');
  const freezerBreastMilk = freezerItems.filter((i) => i.category === 'breast milk');

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Section Header — Figma: Section Header (555:6495) Name=My Kitchen, search=false */}
      <div className="flex items-center justify-between px-4 pb-[13px] pt-3 bg-neutral-primary border-b border-neutral-primary shrink-0">
        <button
          className="flex items-center justify-center size-9 rounded-full text-neutral-primary cursor-pointer hover:bg-neutral-secondary outline-none transition-colors"
          aria-label="Back"
        >
          <ChevronLeftIcon />
        </button>
        <h1 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          My Kitchen
        </h1>
        <div className="flex items-center">
          <button className="flex items-center justify-center size-9 rounded-full text-neutral-primary cursor-pointer hover:bg-neutral-secondary outline-none transition-colors">
            <SearchIcon />
          </button>
          <button className="flex items-center justify-center size-9 rounded-full text-neutral-primary cursor-pointer hover:bg-neutral-secondary outline-none transition-colors">
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* My Kitchen Category Bar — Figma: My Kitchen Category Bar (550:5073) */}
      <div className="flex items-center border-b border-neutral-primary bg-neutral-primary shrink-0 pl-4 pr-3">
        <Tab
          label="Fridge"
          selected={activeTab === 'fridge'}
          onClick={() => setActiveTab('fridge')}
        />
        <Tab
          label="Freezer"
          selected={activeTab === 'freezer'}
          onClick={() => setActiveTab('freezer')}
        />
        <Tab
          label="Pantry"
          selected={activeTab === 'pantry'}
          onClick={() => setActiveTab('pantry')}
        />
        <div className="ml-auto">
          <Button variant="no-bg" size="sm" pill={false} iconLeft={<PlusSmallIcon />}>
            Add
          </Button>
        </div>
      </div>

      {/* ── Fridge Content ──────────────────────────────────────────────────── */}
      {activeTab === 'fridge' && (
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-[170px]">
          {/* Expiry warning banner — Figma: category menu bar (432x61) */}
          <div className="flex items-center justify-between px-4 py-[10px]">
            {expiringCount > 0 && (
              <div className="bg-warning-subtle rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <span className="font-picky-sans font-semibold text-[13px] leading-[1.4] text-warning-primary whitespace-nowrap">
                  ⚠️ {expiringCount} item{expiringCount !== 1 ? 's' : ''} expiring soon
                </span>
              </div>
            )}
            <button
              className="ml-auto flex items-center justify-center size-8 text-neutral-tertiary cursor-pointer outline-none hover:text-neutral-secondary"
              aria-label="More options"
            >
              <KebabIcon />
            </button>
          </div>

          {/* Earl Says Card — Figma: Earl Says Card (595:12331) buttonCount=2 */}
          {!earlDismissed && (
            <div className="px-4 pb-4">
              <EarlSaysCard
                message="Your chicken thighs expire tomorrow. I can make Chicken Stir Fry in 20 min — want me to add it to tonight?"
                ctaLabel="Yes, please!"
                secondaryCtaLabel="Show me other options!"
                onDismiss={() => setEarlDismissed(true)}
              />
            </div>
          )}

          {/* Inventory category sections */}
          <div className="px-4 flex flex-col gap-5">
            {fridgeProduce.length > 0 && (
              <InventoryCategorySection type="produce" items={fridgeProduce} />
            )}
            {fridgeProtein.length > 0 && (
              <InventoryCategorySection type="protein" items={fridgeProtein} />
            )}
            {fridgeDairy.length > 0 && (
              <InventoryCategorySection type="dairy" items={fridgeDairy} />
            )}
          </div>
        </div>
      )}

      {/* ── Freezer Content ─────────────────────────────────────────────────── */}
      {activeTab === 'freezer' && (
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-[170px]">
          {/* Top row — just the kebab menu (Figma: Container 432x44) */}
          <div className="flex items-center justify-end px-4 py-2">
            <button
              className="flex items-center justify-center size-8 text-neutral-tertiary cursor-pointer outline-none hover:text-neutral-secondary"
              aria-label="More options"
            >
              <KebabIcon />
            </button>
          </div>

          {/* Inventory category sections */}
          <div className="px-4 flex flex-col gap-5">
            {freezerMeals.length > 0 && (
              <InventoryCategorySection type="frozen meals" items={freezerMeals} />
            )}
            {freezerProtein.length > 0 && (
              <InventoryCategorySection type="protein" items={freezerProtein} />
            )}
            {(freezerBreastMilk.length > 0) && (
              <InventoryCategorySection type="breast milk" items={freezerBreastMilk} />
            )}
          </div>
        </div>
      )}

      {/* ── Pantry Empty State ───────────────────────────────────────────────── */}
      {activeTab === 'pantry' && (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-8 px-8 bg-neutral-secondary pb-[93px]">
          {/* Icon + copy */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="size-[88px] bg-white rounded-full flex items-center justify-center shadow-[0px_4px_14px_-6px_rgba(44,2,56,0.15)]">
              <span className="text-neutral-primary">
                <CameraPlusIcon />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-picky-sans font-bold text-[20px] leading-[1.3] text-neutral-primary">
                Scan your Pantry
              </h2>
              <p className="font-picky-sans font-normal text-[15px] leading-[1.5] text-neutral-secondary">
                Take a photo and I&apos;ll identify what you have.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Button variant="primary" size="lg" pill className="w-full justify-center">
              Take a photo
            </Button>
            <div className="flex justify-center">
              <Button variant="no-bg" size="md" iconLeft={<PlusSmallIcon />}>
                Add items manually
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAB — camera/add (Figma: Button Type=Primary Pill=True Icon=Alone 56×56) */}
      <button
        className="fixed bottom-[104px] right-4 size-14 rounded-full bg-brand-primary flex items-center justify-center shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)] cursor-pointer hover:bg-brand-quarternary transition-colors z-10 outline-none"
        aria-label="Add item"
      >
        <PlusIcon />
      </button>

      <BottomNav activeTab="home" />
    </div>
  );
}
