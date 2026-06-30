import Image from 'next/image';
import { Tag } from './Tag';
import { Button } from './Button';
import { TransparentOverlayButton } from './TransparentOverlayButton';

// Figma: Recipe Hero (658:17729)
// Variants: destination=home|recipe

type HomeHeroProps = {
  destination?: 'home';
  imageUrl: string;
  title: string;
  tags: string[];
  isTonight?: boolean;
  onViewRecipe?: () => void;
  onSwapMeal?: () => void;
};

type RecipeHeroDetailProps = {
  destination: 'recipe';
  imageUrl: string;
  title: string;
  tags: string[];
  subtitle: string;
  saved?: boolean;
  onBack?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
};

type RecipeHeroProps = HomeHeroProps | RecipeHeroDetailProps;

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

export function RecipeHero(props: RecipeHeroProps) {
  const { imageUrl, title, tags } = props;

  if (props.destination === 'recipe') {
    const { subtitle, saved = false, onBack, onBookmark, onMore } = props;
    return (
      <div className="relative h-[340px] w-full shrink-0 overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="390px"
          className="object-cover"
          priority
        />

        {/* Gradient overlay — starts at 94px from top (340−246), h=246px */}
        <div
          className="absolute inset-x-0 top-[94px] h-[246px] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(75,54,81,0) 0%, #2c0238 100%)' }}
        />

        {/* Back button — top-left */}
        <TransparentOverlayButton
          type="back"
          size="large"
          onClick={onBack}
          className="absolute left-2 top-2 z-10"
        />

        {/* Top-right action buttons */}
        <div className="absolute right-2 top-2 z-10 flex gap-4">
          <TransparentOverlayButton type="favorite" size="large" selected={saved} onClick={onBookmark} />
          <TransparentOverlayButton type="edit" size="large" onClick={onMore} />
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-6 bottom-5 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {/* Headings/H4 Bold — Playpen Sans 32px SemiBold, 120% line-height */}
            <h2 className="font-picky-hand font-semibold text-[32px] leading-[1.2] text-neutral-inverse">
              {title}
            </h2>
            {/* Body/Small/Base — 14px Regular, 140% line-height */}
            <p className="font-picky-sans font-normal text-[14px] leading-[1.4] text-neutral-inverse">
              {subtitle}
            </p>
          </div>

          <div className="flex gap-[7px] items-end flex-wrap">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} type="inverse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // destination=home (default)
  const { isTonight = true, onViewRecipe, onSwapMeal } = props as HomeHeroProps;
  return (
    <div className="relative h-[300px] w-full shrink-0 overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 200px"
        className="object-cover"
        priority
      />

      <div
        className="absolute inset-x-0 top-[54px] h-[246px] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(75,54,81,0) 0%, #2c0238 100%)' }}
      />

      <div className="absolute inset-0 flex flex-col justify-end px-6 py-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start">
            <div className="flex gap-1.5 items-baseline">
              <span className="text-[#fdc700] text-[14px] leading-5">⭐</span>
              <span className="font-picky-sans font-bold text-[10px] leading-[1.4] tracking-[0.1px] text-[var(--text\/neutral-inverse\/primary,#f4f2f5)] uppercase whitespace-nowrap">
                {isTonight ? "Tonight's Pick" : 'Featured'}
              </span>
            </div>

            <div className="pb-2">
              <h2 className="font-picky-hand font-semibold text-[24px] leading-[1.2] text-[var(--text\/neutral-inverse\/primary,#f4f2f5)] whitespace-nowrap">
                {title}
              </h2>
            </div>

            <div className="pb-1">
              <div className="flex gap-[7px] items-end">
                {tags.map((tag) => (
                  <Tag key={tag} label={tag} type="inverse" />
                ))}
              </div>
            </div>
          </div>

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
