// Figma: Inventory item (651:11693)
// Variants: expiry pill shown (stacked layout) vs expiry date text inline (wrap layout)
//
// Layout — has pill:   [emoji] | [name qty / recipe / frozenDate] | [SemanticPill kebab]
// Layout — no pill:   [emoji] | [name qty recipe frozenDate → exp.date] | [kebab]

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
  expiryDate?: string;
  onMenu?: () => void;
};

export function InventoryItem({
  emoji,
  name,
  quantity,
  frozenDate,
  recipeLink,
  expiry,
  expiryDate,
  onMenu,
}: InventoryItemProps) {
  const hasPill = !!expiry;

  return (
    <div className="flex items-start gap-3 bg-neutral-primary border border-neutral-primary rounded-[12px] p-4 w-full">
      {/* Emoji — Headings/H5, font-handwritten */}
      <span
        className="font-picky-hand text-[24px] leading-[1.2] shrink-0 select-none"
        aria-hidden="true"
      >
        {emoji}
      </span>

      {/* Middle content */}
      <div className="flex-1 min-w-0">
        {hasPill ? (
          // Stacked layout: name+qty inline, recipe and frozenDate on separate lines below
          <div className="flex flex-col gap-0.5">
            <p className="font-picky-sans">
              <span className="font-semibold text-[16px] leading-[1.5] text-neutral-primary">{name}</span>
              <span className="font-normal text-[14px] leading-[1.5] text-neutral-tertiary"> {quantity}</span>
            </p>
            {recipeLink && (
              <Link
                href={`/recipe/${recipeLink.id}`}
                className="font-picky-sans font-semibold text-[12px] leading-[1.4] text-brand-primary tracking-[0.24px]"
              >
                {recipeLink.name}
              </Link>
            )}
            {frozenDate && (
              <p className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-disabled">
                {frozenDate}
              </p>
            )}
          </div>
        ) : (
          // Inline layout: all text flows in one wrap row; expiry date anchored at right
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <div className="flex flex-wrap items-baseline gap-x-3 flex-1 min-w-0">
              <span className="font-picky-sans font-semibold text-[16px] leading-[1.5] text-neutral-primary whitespace-nowrap">
                {name}
              </span>
              <span className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary whitespace-nowrap">
                {quantity}
              </span>
              {recipeLink && (
                <span className="font-picky-sans font-semibold text-[12px] leading-[1.4] text-brand-primary tracking-[0.24px] whitespace-nowrap">
                  {recipeLink.name}
                </span>
              )}
              {frozenDate && (
                <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-disabled whitespace-nowrap">
                  {frozenDate}
                </span>
              )}
            </div>
            {expiryDate && (
              <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary whitespace-nowrap shrink-0">
                {expiryDate}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: pill (when expiring) + kebab */}
      <div className="flex items-center gap-3 shrink-0">
        {hasPill && (
          <SemanticPill label={expiry!.label} type={expiry!.type} size="small" />
        )}
        <button
          onClick={onMenu}
          className="flex items-center justify-center w-5 h-5 text-neutral-tertiary cursor-pointer outline-none hover:text-neutral-secondary"
          aria-label="Item options"
        >
          <KebabIcon />
        </button>
      </div>
    </div>
  );
}
