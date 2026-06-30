// Figma: Recipe ingredient (699:8007)
// Variants: state=in pantry|missing item|added to grocery list

type RecipeIngredientProps = {
  name: string;
  state: 'in pantry' | 'missing item' | 'added to grocery list';
};

export function RecipeIngredient({ name, state }: RecipeIngredientProps) {
  return (
    <div className="flex items-center justify-between min-h-[24px] w-full gap-3">
      <span
        className={`font-picky-sans font-normal text-[16px] leading-[1.4] flex-1 min-w-0 ${
          state === 'added to grocery list' ? 'text-neutral-tertiary line-through' : 'text-neutral-primary'
        }`}
      >
        {name}
      </span>

      {state === 'in pantry' && (
        <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-success-primary whitespace-nowrap shrink-0">
          In pantry ✓
        </span>
      )}
      {state === 'missing item' && (
        <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-error-primary whitespace-nowrap shrink-0">
          Missing Item
        </span>
      )}
      {state === 'added to grocery list' && (
        <span className="font-picky-sans font-bold text-[12px] leading-[1.4] text-brand-primary whitespace-nowrap shrink-0">
          ✓ In list
        </span>
      )}
    </div>
  );
}
