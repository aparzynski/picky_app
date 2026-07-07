"use client";

import { useState, useRef } from 'react';
import { usePickyStore, type GroceryItem } from '@/store/usePickyStore';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';
import { EarlSaysCard } from '@/components/EarlSaysCard';
import { Tab } from '@/components/Tab';
import { GroceryListCategoryCard } from '@/components/GroceryListCategoryCard';

const CATEGORY_ORDER: GroceryItem['category'][] = ['produce', 'protein', 'dairy', 'pantry'];
const STORES = ['Walmart', 'Wegmans', 'Costco'] as const;
type Store = (typeof STORES)[number];

// ── Icon helpers ──────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4-4 4 4" />
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

// ── Accordion header ──────────────────────────────────────────────────────────
// Figma: Accordion header (806:9620), expanded=true|false

function AccordionHeader({
  label,
  expanded,
  onToggle,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-0.5 outline-none cursor-pointer"
    >
      <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-neutral-secondary uppercase tracking-widest">
        {label}
      </span>
      <span className="text-neutral-secondary">
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </span>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GroceryPage() {
  const { groceryItems, toggleGroceryItem } = usePickyStore();

  const [activeStore, setActiveStore] = useState<'all' | Store>('all');
  const [stillExpanded, setStillExpanded] = useState(true);
  const [purchasedExpanded, setPurchasedExpanded] = useState(true);
  const [earlDismissed, setEarlDismissed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleToggle(id: string) {
    const item = groceryItems.find((i) => i.id === id);
    if (!item) return;
    const willBePurchased = !item.purchased;
    toggleGroceryItem(id);
    const message = willBePurchased
      ? `${item.name} has been added to purchased items.`
      : `${item.name} has been removed from purchased items.`;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  // Filter by active store tab
  const tabItems =
    activeStore === 'all'
      ? groceryItems
      : groceryItems.filter((i) => i.store === activeStore);

  const stillNeeded = tabItems.filter((i) => !i.purchased);
  const purchased = tabItems.filter((i) => i.purchased);

  // Group into ordered category buckets, drop empties
  const groupByCategory = (items: GroceryItem[]) =>
    CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: items.filter((i) => i.category === cat),
    })).filter((g) => g.items.length > 0);

  // Per-store item counts (for tab badge)
  const storeCount = (store: Store) =>
    groceryItems.filter((i) => i.store === store).length;

  // Summary tag values
  const uniqueRecipes = [...new Set(groceryItems.flatMap((i) => i.recipes.map((r) => r.id)))];
  const staplesNeeded = groceryItems.filter(
    (i) => i.category === 'pantry' && !i.purchased
  ).length;

  return (
    <div className="relative flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      {/* Section Header — Grocery List (Figma: 559:9280) */}
      <div className="flex items-center justify-between px-4 pb-[13px] pt-3 bg-neutral-primary border-b border-[#ece8ed] shrink-0">
        <h1 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-neutral-primary">
          Grocery List
        </h1>
        <div className="flex items-center">
          <button className="p-2 rounded-full text-neutral-primary cursor-pointer hover:text-brand-primary outline-none transition-colors">
            <ShareIcon />
          </button>
          <button className="p-2 rounded-full text-neutral-primary cursor-pointer hover:text-brand-primary outline-none transition-colors">
            <FilterIcon />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-[140px]">

        {/* Summary + Earl — padded content area */}
        <div className="px-4 pt-4 flex flex-col gap-4">

          {/* Tags row — Figma: Frame 63 (806:10369) — brand quinary pills */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-brand-quinary rounded-full px-3 py-1">
              <span className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary">
                🗓️ {uniqueRecipes.length} meals this week
              </span>
            </div>
            <div className="bg-brand-quinary rounded-full px-3 py-1">
              <span className="font-picky-sans font-normal text-[14px] leading-[1.5] text-brand-primary">
                🧂 {staplesNeeded} staples needed
              </span>
            </div>
          </div>

          {/* Earl Says Card — buttonCount=3 suggestions variant */}
          {!earlDismissed && (
            <EarlSaysCard
              message="You usually buy these — want to add them?"
              suggestions={['Eggs', 'Bread', 'Butter']}
              onDismiss={() => setEarlDismissed(true)}
            />
          )}
        </div>

        {/* Store tabs — Figma: tabs (806:8887) */}
        <div className="border-b border-[#ece8ed] mt-4">
          <div className="flex items-center overflow-x-auto px-1">
            <Tab
              label="All"
              selected={activeStore === 'all'}
              onClick={() => setActiveStore('all')}
            />
            {STORES.map((store) => (
              <Tab
                key={store}
                label={store}
                selected={activeStore === store}
                count={storeCount(store)}
                onClick={() => setActiveStore(store)}
              />
            ))}
          </div>
        </div>

        {/* List content */}
        <div className="px-4 pt-5 flex flex-col gap-6">

          {/* Still Needed — Figma: Accordion header (806:9303, expanded=true) */}
          {stillNeeded.length > 0 && (
            <div className="flex flex-col gap-3">
              <AccordionHeader
                label="Still Needed"
                expanded={stillExpanded}
                onToggle={() => setStillExpanded((v) => !v)}
              />
              {stillExpanded && (
                <div className="flex flex-col gap-4">
                  {groupByCategory(stillNeeded).map(({ category, items }) => (
                    <GroceryListCategoryCard
                      key={category}
                      category={category}
                      items={items}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Purchased — Figma: purchased (806:9369) */}
          {purchased.length > 0 && (
            <div className="flex flex-col gap-3">
              <AccordionHeader
                label="Purchased"
                expanded={purchasedExpanded}
                onToggle={() => setPurchasedExpanded((v) => !v)}
              />
              {purchasedExpanded && (
                <div className="flex flex-col gap-4">
                  {groupByCategory(purchased).map(({ category, items }) => (
                    <GroceryListCategoryCard
                      key={category}
                      category={category}
                      items={items}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {stillNeeded.length === 0 && purchased.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="font-picky-sans font-semibold text-[18px] text-neutral-secondary">
                All done! 🎉
              </p>
              <p className="font-picky-sans font-normal text-[14px] text-neutral-tertiary">
                No items for this store.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success toast pill — Figma: SemanticPill size=medium type=success (658:17784) */}
      {toast && (
        <div className="fixed bottom-[113px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-success-subtle rounded-full px-4 py-2">
            <span className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-success-primary whitespace-nowrap">
              {toast}
            </span>
          </div>
        </div>
      )}

      {/* FAB — Add item (Figma: Button 658:17033, 56×56 brand circle) */}
      <button
        className="fixed bottom-[104px] right-4 size-14 rounded-full bg-brand-primary flex items-center justify-center shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)] cursor-pointer hover:bg-brand-quarternary transition-colors z-10 outline-none"
        aria-label="Add grocery item"
      >
        <PlusIcon />
      </button>

      <BottomNav activeTab="home" />
    </div>
  );
}
