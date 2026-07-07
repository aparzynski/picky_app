// Figma: Grocery List Category Card (806:9889)
// Variants: type=produce|protein|dairy|pantry

import Link from 'next/link'
import type { GroceryItem } from '@/store/usePickyStore'

type CategoryConfig = {
  emoji: string
  label: string
  headerBg: string
  textColor: string
}

const CATEGORY_CONFIG: Record<GroceryItem['category'], CategoryConfig> = {
  produce: { emoji: '🥦', label: 'PRODUCE', headerBg: 'bg-success-subtle', textColor: 'text-success-primary' },
  protein: { emoji: '🥩', label: 'PROTEIN', headerBg: 'bg-error-subtle',   textColor: 'text-error-primary'   },
  dairy:   { emoji: '🧀', label: 'DAIRY',   headerBg: 'bg-info-subtle',    textColor: 'text-info-primary'    },
  pantry:  { emoji: '🥫', label: 'PANTRY',  headerBg: 'bg-brand2-quinary', textColor: 'text-brand2-primary'  },
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Props = {
  category: GroceryItem['category']
  items: GroceryItem[]
  onToggle: (id: string) => void
}

export function GroceryListCategoryCard({ category, items, onToggle }: Props) {
  const cfg = CATEGORY_CONFIG[category]

  return (
    <div className="w-full rounded-[16px] overflow-hidden shadow-[0px_10px_30px_-4px_rgba(44,2,56,0.11),0px_4px_14px_-6px_rgba(44,2,56,0.15)]">
      {/* Category header */}
      <div className={`${cfg.headerBg} flex items-baseline justify-between px-4 py-3`}>
        <div className="flex items-center gap-2">
          <span className="text-base leading-6 shrink-0">{cfg.emoji}</span>
          <span className={`font-picky-sans font-semibold text-[14px] leading-[1.5] ${cfg.textColor}`}>
            {cfg.label}
          </span>
        </div>
        <span className={`font-picky-sans font-semibold text-[14px] leading-[1.5] ${cfg.textColor}`}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items list */}
      <div className="bg-white flex flex-col">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={[
              'flex items-start gap-3 px-4 py-3 w-full',
              idx < items.length - 1 ? 'border-b border-item-divider' : '',
            ].join(' ')}
          >
            {/* Checkbox — only interactive element in the row */}
            <div className="pt-1 shrink-0">
              <button
                onClick={() => onToggle(item.id)}
                className={[
                  'size-5 rounded-[4px] flex items-center justify-center shrink-0 cursor-pointer outline-none',
                  item.purchased
                    ? 'bg-brand-primary p-[2px]'
                    : 'bg-neutral-secondary border-2 border-[#c0b9c2]',
                ].join(' ')}
                aria-label={item.purchased ? `Unmark ${item.name} as purchased` : `Mark ${item.name} as purchased`}
              >
                {item.purchased && <CheckIcon />}
              </button>
            </div>

            {/* Name + recipe(s) */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="font-picky-sans text-neutral-primary leading-none">
                <span className="font-semibold text-[18px] leading-[1.5]">{item.name}</span>
                <span className="font-normal text-[14px] leading-[1.5]">, {item.quantity}</span>
              </p>
              {item.recipes.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {item.recipes.map((recipe, i) => (
                    <span key={recipe.id} className="flex items-center gap-1">
                      {i > 0 && (
                        <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-neutral-tertiary">
                          ·
                        </span>
                      )}
                      <Link
                        href={`/recipe/${recipe.id}`}
                        className="font-picky-sans font-bold text-[12px] leading-[1.4] text-brand-primary"
                      >
                        {recipe.name}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Store pill tag */}
            <div className="bg-overlay-neutral-q rounded-full px-2 py-0.5 shrink-0 self-start mt-0.5">
              <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-secondary whitespace-nowrap">
                {item.store}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
