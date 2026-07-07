'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePickyStore } from '@/store/usePickyStore';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { DAY_NAME_TO_IDX, hasMeal, type MealType } from '@/lib/plannerData';

// ─── Types ───────────────────────────────────────────────────────────────────

type AvatarColor = 'purple' | 'blue' | 'orange' | 'green';

type SwapCandidate = {
  id: string;
  name: string;
  emoji: string;
  cookTime: number;
  serves: number;
  rating: number;
  calories: number;
  imageUrl: string;
  tags: string[];
};

export type Props = {
  dayName: string;
  mealType: MealType;
  familyIds: string[];
  currentRecipeId: string;
  onClose: () => void;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const SWAP_CANDIDATES: SwapCandidate[] = [
  {
    id: 'pw6', name: 'Honey Garlic Salmon Bowls', emoji: '🐟',
    cookTime: 30, serves: 4, rating: 4.8, calories: 480,
    imageUrl: '/mock/d4.jpg',
    tags: ['🐟 Seafood', 'High Protein', 'Bowl'],
  },
  {
    id: 'pw15', name: 'Weeknight Beef Tacos', emoji: '🌮',
    cookTime: 25, serves: 4, rating: 4.6, calories: 520,
    imageUrl: '/mock/r4.jpg',
    tags: ['🌮 Mexican', 'Kid Favorite', 'Quick Weeknight'],
  },
];

const MOOD_CHIPS = [
  'Mexican 🇲🇽', 'Comfort food',
  'Kid-friendly', 'Quick & easy',
  'Indian 🇮🇳', 'One Pan 🔍',
  'Light & healthy', 'American 🇺🇸',
  'Japanese 🇯🇵', 'Italian 🇮🇹',
];

const PANTRY_ITEMS = [
  'Eggs · 4 left · exp. today',
  'Milk · 1/2 carton · exp. tomorrow',
  'Cheddar · 100g · exp. in 2 days',
];

const FAMILY_OPTIONS: { initials: string; name: string; color: AvatarColor }[] = [
  { initials: 'S', name: 'Sarah', color: 'purple' },
  { initials: 'D', name: 'David', color: 'blue' },
  { initials: 'M', name: 'Mia', color: 'orange' },
  { initials: 'N', name: 'Noah', color: 'green' },
  { initials: 'L', name: 'Lily', color: 'orange' },
  { initials: 'E', name: 'Ethan', color: 'blue' },
];

// ─── Shared sub-components ───────────────────────────────────────────────────

// 56px Earl avatar for modal header
function ModalEarlAvatar() {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-brand-primary shrink-0"
      style={{ width: 56, height: 56 }}
    >
      <div className="relative" style={{ width: 39, height: 42 }}>
        <div className="absolute inset-[2.49%_44.71%_15.81%_2.69%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 size-full" src="/assets/earl-highlight.svg" />
        </div>
        <div className="absolute inset-[3.9%_10.71%_7.81%_6.81%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 size-full" src="/assets/earl-facee.svg" />
        </div>
        <div className="absolute inset-[36.57%_2.6%_2.45%_5.54%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 size-full" src="/assets/earl-shadow.svg" />
        </div>
        <div className="absolute inset-[53.54%_24.84%_23.27%_25.09%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 size-full" src="/assets/earl-face.svg" />
        </div>
        <div className="absolute inset-[23.04%_21.85%_54.89%_58.91%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 size-full" src="/assets/earl-crease.svg" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 size-full" src="/assets/earl-logo.svg" />
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5 9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10l5-5" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Step header with optional back arrow, centered Earl avatar, close button
function StepHeader({
  onBack,
  onClose,
}: {
  onBack?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      {onBack ? (
        <button onClick={onBack} className="p-1 text-neutral-secondary cursor-pointer" aria-label="Back">
          <BackIcon />
        </button>
      ) : (
        <div className="w-[28px]" />
      )}
      <ModalEarlAvatar />
      <button onClick={onClose} className="p-1 text-neutral-secondary cursor-pointer" aria-label="Close">
        <CloseIcon />
      </button>
    </div>
  );
}

// Recipe card used in steps 3, 4, 5
function ModalRecipeCard({
  recipe,
  footer,
}: {
  recipe: SwapCandidate;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] overflow-hidden border border-neutral-primary bg-neutral-primary">
      <div className="relative w-full" style={{ height: 180 }}>
        <Image
          src={recipe.imageUrl}
          alt={recipe.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <p className="font-picky-hand font-semibold text-[18px] leading-[1.2] text-neutral-primary">
          {recipe.name}
        </p>
        <p className="font-picky-sans font-normal text-[13px] leading-[1.5] text-neutral-tertiary">
          {recipe.cookTime} min · Serves {recipe.serves} · ⭐ {recipe.rating} · {recipe.calories} calories
        </p>
        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <Tag key={tag} label={tag} type="inverse2" />
          ))}
        </div>
        {footer && <div className="pt-1">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Step 1: Who's Eating ────────────────────────────────────────────────────

function Step1({
  selected,
  onToggle,
  onContinue,
  onClose,
}: {
  selected: string[];
  onToggle: (initials: string) => void;
  onContinue: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <StepHeader onClose={onClose} />
      <div className="flex flex-col gap-5 px-5 pb-6">
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-picky-hand font-semibold text-[22px] leading-[1.2] text-neutral-primary text-center">
            Who&apos;s Eating?
          </h2>
          <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary text-center">
            Select family members
          </p>
        </div>

        {/* Family member circles */}
        <div className="flex flex-wrap gap-x-3 gap-y-4">
          {FAMILY_OPTIONS.map((member) => {
            const isSelected = selected.includes(member.initials);
            return (
              <button
                key={member.initials}
                onClick={() => onToggle(member.initials)}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="relative">
                  <Avatar initials={member.initials} color={member.color} size={48} />
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-brand-primary flex items-center justify-center shadow-sm">
                      <CheckIcon />
                    </div>
                  )}
                </div>
                <span className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-secondary">
                  {member.name}
                </span>
              </button>
            );
          })}
        </div>

        <Button variant="primary" size="lg" pill onClick={onContinue} className="w-full">
          Continue
        </Button>
      </div>
    </>
  );
}

// ─── Step 2: Mood selection ───────────────────────────────────────────────────

function Step2({
  selectedMoods,
  onToggleMood,
  onShowOptions,
  onSurpriseMe,
  onBack,
  onClose,
}: {
  selectedMoods: string[];
  onToggleMood: (mood: string) => void;
  onShowOptions: () => void;
  onSurpriseMe: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <StepHeader onBack={onBack} onClose={onClose} />
      <div className="flex flex-col gap-5 px-5 pb-6">
        {/* Title */}
        <h2 className="font-picky-hand font-semibold text-[22px] leading-[1.2] text-neutral-primary text-center">
          What are you in the mood for?
        </h2>

        {/* Expiring pantry card */}
        <div className="flex flex-col gap-3 rounded-[12px] bg-brand-tertiary border border-brand-inverse px-4 py-3">
          <p className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary">
            Use up before it&apos;s too late!
          </p>
          <div className="flex flex-wrap gap-2">
            {PANTRY_ITEMS.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full bg-neutral-primary font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-secondary"
              >
                {item}
              </span>
            ))}
          </div>
          <Button variant="primary" size="sm" pill onClick={onShowOptions} className="w-full">
            Use these ingredients
          </Button>
        </div>

        {/* Mood chips */}
        <div className="flex flex-wrap gap-2">
          {MOOD_CHIPS.map((mood) => {
            const isSelected = selectedMoods.includes(mood);
            return (
              <button
                key={mood}
                onClick={() => onToggleMood(mood)}
                className={`px-3 py-1.5 rounded-full font-picky-sans font-normal text-[14px] leading-[1.5] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-brand-primary text-neutral-inverse border-brand-primary'
                    : 'bg-neutral-primary text-neutral-primary border-neutral-primary'
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-1">
          <Button variant="primary" size="lg" pill onClick={onShowOptions} className="w-full">
            Show me options
          </Button>
          <button
            onClick={onSurpriseMe}
            className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-3"
          >
            Surprise Me!
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Step 3: Surprise Me single pick ─────────────────────────────────────────

function Step3({
  recipe,
  onConfirm,
  onPickDifferent,
  onBack,
  onClose,
}: {
  recipe: SwapCandidate;
  onConfirm: () => void;
  onPickDifferent: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <StepHeader onBack={onBack} onClose={onClose} />
      <div className="flex flex-col gap-5 px-5 pb-6">
        <h2 className="font-picky-hand font-semibold text-[22px] leading-[1.2] text-neutral-primary text-center">
          I picked this for you 🍑
        </h2>

        <ModalRecipeCard recipe={recipe} />

        <div className="flex flex-col gap-1">
          <Button variant="primary" size="lg" pill onClick={onConfirm} className="w-full">
            Confirm — let&apos;s eat this!
          </Button>
          <button
            onClick={onPickDifferent}
            className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-3"
          >
            Pick a different one ↗️
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Step 4: Results list ─────────────────────────────────────────────────────

function Step4({
  onSwapIn,
  onBrowseAll,
  onBack,
  onClose,
}: {
  onSwapIn: (recipe: SwapCandidate) => void;
  onBrowseAll: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <StepHeader onBack={onBack} onClose={onClose} />
      <div className="flex flex-col gap-5 px-5 pb-6">
        {/* Title + subtitle */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-picky-hand font-semibold text-[22px] leading-[1.2] text-neutral-primary text-center">
            Here&apos;s what I found!
          </h2>
          <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary">
            {SWAP_CANDIDATES.length} matches
          </p>
        </div>

        {/* Recipe list */}
        <div className="flex flex-col gap-4">
          {SWAP_CANDIDATES.map((recipe) => (
            <ModalRecipeCard
              key={recipe.id}
              recipe={recipe}
              footer={
                <Button variant="primary" size="md" pill onClick={() => onSwapIn(recipe)} className="w-full">
                  Swap In ↗️
                </Button>
              }
            />
          ))}
        </div>

        <Button variant="secondary" size="lg" pill onClick={onBrowseAll} className="w-full">
          Browse all recipes
        </Button>
      </div>
    </>
  );
}

// ─── Step 5: Confirmation ─────────────────────────────────────────────────────

function Step5({
  recipe,
  mealType,
  dayName,
  onViewRecipe,
  onClose,
}: {
  recipe: SwapCandidate;
  mealType: MealType;
  dayName: string;
  onViewRecipe: () => void;
  onClose: () => void;
}) {
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const isTonight = mealType === 'DINNER' && dayName === todayName;

  const mealLabel = isTonight
    ? "tonight"
    : mealType === 'BREAKFAST'
    ? `${dayName === todayName ? "today's breakfast" : `${dayName}'s breakfast`}`
    : mealType === 'LUNCH'
    ? `${dayName === todayName ? "today's lunch" : `${dayName}'s lunch`}`
    : `${dayName}'s dinner`;

  return (
    <>
      <StepHeader onClose={onClose} />
      <div className="flex flex-col gap-5 px-5 pb-6">
        {/* Title + subtitle */}
        <div className="flex flex-col gap-2">
          <h2 className="font-picky-hand font-semibold text-[22px] leading-[1.2] text-brand-primary text-center">
            Done! {recipe.name} is on for {mealLabel}. 🎉
          </h2>
          <p className="font-picky-sans font-normal text-[14px] leading-[1.5] text-neutral-tertiary text-center">
            I&apos;ve updated your meal plan. Your family is going to love this.
          </p>
        </div>

        <ModalRecipeCard recipe={recipe} />

        <Button variant="primary" size="lg" pill onClick={onViewRecipe} className="w-full">
          View Recipe →
        </Button>
      </div>
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function SwapMealModal({ dayName, mealType, familyIds, currentRecipeId, onClose }: Props) {
  const router = useRouter();
  const swapPlannerMeal = usePickyStore((s) => s.swapPlannerMeal);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedFamily, setSelectedFamily] = useState<string[]>(
    FAMILY_OPTIONS.map((f) => f.initials).filter((i) => familyIds.includes(i)),
  );
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [pickedRecipe, setPickedRecipe] = useState<SwapCandidate | null>(null);

  function toggleFamily(initials: string) {
    setSelectedFamily((prev) =>
      prev.includes(initials) ? prev.filter((i) => i !== initials) : [...prev, initials],
    );
  }

  function toggleMood(mood: string) {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  }

  function handleSurpriseMe() {
    const candidates = SWAP_CANDIDATES.filter((r) => r.id !== currentRecipeId);
    const recipe = candidates[Math.floor(Math.random() * candidates.length)] ?? SWAP_CANDIDATES[0];
    setPickedRecipe(recipe);
    setStep(3);
  }

  function commitSwap(recipe: SwapCandidate) {
    const dayIdx = DAY_NAME_TO_IDX[dayName] ?? 0;
    const newMeal = hasMeal(mealType, recipe.name, recipe.emoji, recipe.cookTime, recipe.id, selectedFamily);
    swapPlannerMeal(dayIdx, mealType, newMeal);
    setPickedRecipe(recipe);
    setStep(5);
  }

  function handleViewRecipe() {
    if (!pickedRecipe) return;
    const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
    const isTonight = mealType === 'DINNER' && dayName === todayName;
    const tonightParam = isTonight ? '&tonight=true' : '';
    const familyParam = selectedFamily.join(',');
    onClose();
    router.push(
      `/recipe/${pickedRecipe.id}?family=${familyParam}&day=${dayName}&meal=${mealType}&mode=swap${tonightParam}`,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div
        className="relative w-full bg-neutral-primary rounded-[20px] shadow-[0px_20px_60px_rgba(0,0,0,0.3)] overflow-y-auto"
        style={{ maxWidth: 390, maxHeight: '88dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
          <Step1
            selected={selectedFamily}
            onToggle={toggleFamily}
            onContinue={() => setStep(2)}
            onClose={onClose}
          />
        )}
        {step === 2 && (
          <Step2
            selectedMoods={selectedMoods}
            onToggleMood={toggleMood}
            onShowOptions={() => setStep(4)}
            onSurpriseMe={handleSurpriseMe}
            onBack={() => setStep(1)}
            onClose={onClose}
          />
        )}
        {step === 3 && pickedRecipe && (
          <Step3
            recipe={pickedRecipe}
            onConfirm={() => commitSwap(pickedRecipe)}
            onPickDifferent={() => setStep(4)}
            onBack={() => setStep(2)}
            onClose={onClose}
          />
        )}
        {step === 4 && (
          <Step4
            onSwapIn={commitSwap}
            onBrowseAll={() => { onClose(); router.push('/discover'); }}
            onBack={() => setStep(2)}
            onClose={onClose}
          />
        )}
        {step === 5 && pickedRecipe && (
          <Step5
            recipe={pickedRecipe}
            mealType={mealType}
            dayName={dayName}
            onViewRecipe={handleViewRecipe}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
