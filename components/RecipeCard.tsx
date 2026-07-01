'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag } from "./Tag";
import { Button } from "./Button";
import { TransparentOverlayButton } from "./TransparentOverlayButton";

type RecipeCardProps = {
  id?: string;
  imageUrl: string;
  name: string;
  cookTime: number;
  tags: string[];
  className?: string;
  onViewMore?: () => void;
  // Chat embed props — used when size='medium'
  size?: 'small' | 'medium';
  serves?: number;
  rating?: number;
  calories?: number;
};

const ChevronIcon = (
  <div className="shrink-0 size-4 flex items-center justify-center">
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.833374 0.833374L5.83337 5.83337L0.833374 10.8334" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export function RecipeCard({
  id,
  imageUrl,
  name,
  cookTime,
  tags,
  className,
  onViewMore,
  size,
  serves,
  rating,
  calories,
}: RecipeCardProps) {
  const router = useRouter();
  const outerClass = `relative min-w-[170px] rounded-[var(--m,12px)] bg-neutral-primary shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col ${className ?? ""}`;

  return (
    <div className={outerClass}>
      {/* Image — links to recipe when id provided */}
      {id ? (
        <Link href={`/recipe/${id}`} className="relative h-32 w-full shrink-0 block">
          <Image src={imageUrl} alt={name} fill sizes="(max-width: 768px) 50vw, 220px" className="object-cover rounded-t-[var(--m,12px)]" />
        </Link>
      ) : (
        <div className="relative h-32 w-full shrink-0">
          <Image src={imageUrl} alt={name} fill sizes="(max-width: 768px) 50vw, 220px" className="object-cover rounded-t-[var(--m,12px)]" />
        </div>
      )}

      {/* Recipe info */}
      <div className="flex flex-col gap-2 p-3">
        {/* Name — links to recipe when id provided */}
        {id ? (
          <Link href={`/recipe/${id}`} className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary whitespace">
            {name}
          </Link>
        ) : (
          <p className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary whitespace">
            {name}
          </p>
        )}

        {/* Cook time + tags */}
        <div className="flex flex-wrap gap-x-1 gap-y-1 items-center w-full">
          <div className="flex items-center gap-0.5">
            <div className="relative size-3 shrink-0">
              <Image src="/assets/icon-clock.svg" alt="" fill sizes="12px" className="object-contain" />
            </div>
            <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
              {cookTime} min
            </span>
          </div>
          {tags.map((tag) => (
            <Tag key={tag} type="inverse2" label={tag} />
          ))}
        </div>

        {/* Expanded meta row — shown when size='medium' and at least one meta value provided */}
        {size === 'medium' && (serves !== undefined || rating !== undefined || calories !== undefined) && (
          <div className="flex items-center gap-3 pt-1">
            {serves !== undefined && (
              <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
                {serves} servings
              </span>
            )}
            {rating !== undefined && (
              <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
                ★ {rating.toFixed(1)}
              </span>
            )}
            {calories !== undefined && (
              <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
                {calories} kcal
              </span>
            )}
          </div>
        )}

        {/* View Recipe button */}
        <Button
          variant="secondary"
          size="sm"
          pill={false}
          iconRight={ChevronIcon}
          onClick={id ? () => router.push(`/recipe/${id}`) : onViewMore}
          className="w-full mt-auto"
        >
          View Recipe
        </Button>
      </div>

      {/* Favorite overlay */}
      <TransparentOverlayButton
        size="medium"
        className="absolute top-[11px] right-[10px]"
      />
    </div>
  );
}
