import Image from "next/image";
import { Tag } from "./Tag";
import { Button } from "./Button";

type RecipeHeroProps = {
  destination?: "home";
  imageUrl: string;
  title: string;
  tags: string[];
  isTonight?: boolean;
  onViewRecipe?: () => void;
  onSwapMeal?: () => void;
};

function SwapIcon() {
  return (
    <svg
      width="15" height="17" viewBox="0 0 15 17"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M10.8334 7.50004L14.1667 4.16671L10.8334 0.833374M14.1667 4.16671H5.83337M4.16671 15.8334L0.833374 12.5L4.16671 9.16671M0.833374 12.5H8.33337"
        stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function RecipeHero({
  imageUrl,
  title,
  tags,
  isTonight = true,
  onViewRecipe,
  onSwapMeal,
}: RecipeHeroProps) {
  return (
    <div className="relative h-[300px] w-full shrink-0 overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      {/* Food photo */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay — pointer-events-none so buttons beneath receive hover/click */}
      <div
        className="absolute inset-x-0 top-[54px] h-[246px] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(75,54,81,0) 0%, #2c0238 100%)",
        }}
      />

      {/* Content — px-6 is the only horizontal padding per frame */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 py-5">
        <div className="flex flex-col gap-3">
          {/* Label row */}
          <div className="flex flex-col items-start">
            <div className="flex gap-1.5 items-baseline">
              <span className="text-[#fdc700] text-[14px] leading-5">⭐</span>
              <span className="font-picky-sans font-bold text-[10px] leading-[1.4] tracking-[0.1px] text-[var(--text\/neutral-inverse\/primary,#f4f2f5)] uppercase whitespace-nowrap">
                {isTonight ? "Tonight's Pick" : "Featured"}
              </span>
            </div>

            {/* Title */}
            <div className="pb-2">
              <h2 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-[var(--text\/neutral-inverse\/primary,#f4f2f5)] whitespace-nowrap">
                {title}
              </h2>
            </div>

            {/* Tags */}
            <div className="pb-1">
              <div className="flex gap-[7px] items-end">
                {tags.map((tag) => (
                  <Tag key={tag} label={tag} type="inverse" />
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 items-center">
            <Button variant="primary" pill className="flex-1" onClick={onViewRecipe}>
              View Recipe
            </Button>

            <Button
              variant="over-image"
              pill
              iconRight={
                <div className="flex items-center justify-center size-5 shrink-0">
                  <SwapIcon />
                </div>
              }
              onClick={onSwapMeal}
              className="shrink-0"
            >
              Swap Meal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
