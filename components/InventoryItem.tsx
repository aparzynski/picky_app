// Figma: Inventory item (651:11693)
// Variants: location: fridge | freezer, breast milk: true | false
//
// Layout (per Figma):
//   emoji | [name + qty (inline) / recipe link / frozen date] | [SemanticPill + kebab]

import Link from 'next/link';
import { SemanticPill } from './SemanticPill';

function KebabIcon() {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" aria-hidden="true">
      <circle cx="2" cy="2"  r="1.5" fill="currentColor" />
      <circle cx="2" cy="8"  r="1.5" fill="currentColor" />
      <circle cx="2" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

type ExpiryInfo = {
  label: string;
  type: 'success' | 'warning' | 'danger';
};

type InventoryItemProps = {
  emoji: string;
  name: string;
  quantity: string;
  frozenDate?: string;
  recipeLink?: { name: string; id: string };
  expiry?: ExpiryInfo | null;
  onMenu?: () => void;
};

export function InventoryItem({
  emoji,
  name,
  quantity,
  frozenDate,
  recipeLink,
  expiry,
  onMenu,
}: InventoryItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 w-full bg-white">
      {/* Emoji icon */}
      <span
        className="text-[22px] leading-none shrink-0 w-6 text-center select-none"
        aria-hidden="true"
      >
        {emoji}
      </span>

      {/* Ingredient info: name+qty row, then recipe link, then frozen date */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className="font-picky-sans text-neutral-primary leading-none">
          <span className="font-semibold text-[16px] leading-[1.4]">{name}</span>
          <span className="font-normal text-[13px] leading-[1.4] text-neutral-secondary"> {quantity}</span>
        </p>
        {recipeLink && (
          <Link
            href={`/recipe/${recipeLink.id}`}
            className="font-picky-sans font-semibold text-[12px] leading-[1.4] text-brand-primary"
          >
            {recipeLink.name}
          </Link>
        )}
        {frozenDate && (
          <p className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
            {frozenDate}
          </p>
        )}
      </div>

      {/* Expiry pill + kebab menu */}
      <div className="flex items-center gap-2 shrink-0">
        {expiry && <SemanticPill label={expiry.label} type={expiry.type} size="small" />}
        <button
          onClick={onMenu}
          className="flex items-center justify-center w-5 h-6 text-neutral-tertiary cursor-pointer outline-none hover:text-neutral-secondary"
          aria-label="Item options"
        >
          <KebabIcon />
        </button>
      </div>
    </div>
  );
}
