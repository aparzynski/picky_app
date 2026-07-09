// Figma: Inventory Category Section (602:13207)
// Variants: type: produce | protein | Dairy | breast milk
//
// Each InventoryItem is its own card — no shared wrapper card.

import type { KitchenItem } from '@/store/usePickyStore';
import { InventoryItem } from './InventoryItem';

type CategoryType = KitchenItem['category'];

const CATEGORY_LABEL: Record<CategoryType, string> = {
  'produce':      'PRODUCE',
  'protein':      'Protein',
  'dairy':        'Dairy',
  'frozen meals': 'Frozen Meals',
  'breast milk':  'Breast Milk',
};

type InventoryCategorySectionProps = {
  type: CategoryType;
  items: KitchenItem[];
};

export function InventoryCategorySection({ type, items }: InventoryCategorySectionProps) {
  const label = CATEGORY_LABEL[type];
  const isBreastMilk = type === 'breast milk';

  return (
    <div className="flex flex-col gap-2">
      {/* Category label */}
      <div className="flex flex-col gap-0.5">
        <span className="font-picky-sans font-semibold text-[12px] leading-[1.4] text-neutral-secondary tracking-wide">
          {label}
        </span>
        {isBreastMilk && (
          <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
            Fridge: 4 days · Freezer: 6 months
          </span>
        )}
      </div>

      {/* Individual item cards */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <InventoryItem
              key={item.id}
              emoji={item.emoji}
              name={item.name}
              quantity={item.quantity}
              frozenDate={item.frozenDate}
              recipeLink={item.recipeLink}
              expiry={item.expiry}
              expiryDate={item.expiryDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
