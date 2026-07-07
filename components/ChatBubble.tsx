'use client';

// Figma: Chat Bubble component set (656:12144)
// Variants: earlMessage × chips × recipe × isTyping

import { RecipeCard } from './RecipeCard';
import { Button } from './Button';
import { EarlAvatar } from './EarlAvatar';
import { usePickyStore } from '@/store/usePickyStore';

type SuggestedChip = {
  label: string;
  onClick?: () => void;
};

type ChatBubbleProps = {
  /** true = Earl message (grey, left-aligned); false = user message (purple, right-aligned) */
  earlMessage: boolean;
  text?: string;
  /** Suggested reply chips — only rendered on Earl messages */
  chips?: SuggestedChip[];
  /** Recipe ID from store to embed inline */
  recipeId?: string;
  /** Earl typing/pending indicator */
  isTyping?: boolean;
  /** Timestamp string — e.g. "9:41 AM" */
  timestamp?: string;
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5" aria-label="Earl is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-2 h-2 rounded-full bg-icon-brand-primary animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </div>
  );
}

export function ChatBubble({
  earlMessage,
  text,
  chips,
  recipeId,
  isTyping = false,
  timestamp,
}: ChatBubbleProps) {
  const recipes = usePickyStore((s) => s.recipes);
  const recipe = recipeId ? recipes[recipeId] : undefined;

  if (earlMessage) {
    return (
      <div className="flex items-start gap-2 w-full">
        {/* Earl avatar — always left */}
        <EarlAvatar className="mt-0.5" />

        <div className="flex flex-col gap-2 flex-1 min-w-0 max-w-[340px]">
          {/* Main bubble — grey */}
          {(isTyping || text) && (
            <div className="rounded-[16px] rounded-tl-[4px] bg-neutral-disabled px-4 py-3">
              {isTyping ? (
                <TypingDots />
              ) : (
                <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-primary whitespace-pre-wrap break-words">
                  {text}
                </p>
              )}
            </div>
          )}

          {/* Inline recipe card */}
          {recipe && (
            <RecipeCard
              id={recipe.id}
              imageUrl={recipe.imageUrl}
              name={recipe.name}
              cookTime={recipe.cookTime}
              tags={recipe.tags}
              serves={recipe.serves}
              rating={recipe.rating}
              calories={recipe.calories}
              size="medium"
              className="w-full max-w-[280px]"
            />
          )}

          {/* Suggested reply chips — Button secondary sm pill, matches Figma 656:12143 */}
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip, i) => (
                <Button key={i} variant="secondary" size="sm" pill={true} onClick={chip.onClick}>
                  {chip.label}
                </Button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          {timestamp && !isTyping && (
            <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-secondary mt-0.5">
              {timestamp}
            </span>
          )}
        </div>
      </div>
    );
  }

  // User bubble — right-aligned, purple
  return (
    <div className="flex justify-end w-full">
      <div className="flex flex-col items-end gap-1 max-w-[280px]">
        <div className="rounded-[16px] rounded-tr-[4px] bg-brand-primary px-4 py-3">
          <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-inverse whitespace-pre-wrap break-words">
            {text}
          </p>
        </div>
        {timestamp && (
          <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-secondary">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
