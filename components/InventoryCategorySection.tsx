// Figma: Inventory Category Section (602:13207)
// Variants: type: produce | protein | Dairy | breast milk
//
// Renders: category label + white rounded card containing InventoryItem rows.
// Breast milk category also shows a storage-duration note below the label.

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

      {/* Items card */}
      {items.length > 0 && (
        <div className="w-full rounded-[16px] overflow-hidden shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)]">
          <div className="flex flex-col bg-white">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={idx < items.length - 1 ? 'border-b border-item-divider' : ''}
              >
                <InventoryItem
                  emoji={item.emoji}
                  name={item.name}
                  quantity={item.quantity}
                  frozenDate={item.frozenDate}
                  recipeLink={item.recipeLink}
                  expiry={item.expiry}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
