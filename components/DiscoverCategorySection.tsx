import { type Recipe } from "@/store/usePickyStore";
import { RecipeCard } from "./RecipeCard";
import { ViewAllButton } from "./ViewAllButton";

type DiscoverCategorySectionProps = {
  title: string;
  recipes: Recipe[];
  savedRecipeIds?: string[];
  onViewMore?: () => void;
};

export function DiscoverCategorySection({ title, recipes, savedRecipeIds = [], onViewMore }: DiscoverCategorySectionProps) {
  return (
    <div className="flex flex-col pt-6 px-4">
      <div className="flex items-baseline justify-between w-full">
        <p className="font-picky-sans font-semibold text-[18px] leading-[1.5] text-neutral-primary whitespace-nowrap">
          {title}
        </p>
        <ViewAllButton label="View More" onClick={onViewMore} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 items-start">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            imageUrl={recipe.imageUrl}
            name={recipe.name}
            cookTime={recipe.cookTime}
            tags={recipe.tags}
            saved={savedRecipeIds.includes(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}
