'use client';

import { useState } from 'react';
import { usePickyStore } from '@/store/usePickyStore';
import { Avatar } from '@/components/Avatar';
import type { MealRating } from '@/store/usePickyStore';

// ── helpers ───────────────────────────────────────────────────────────────────

function derivePronoun(gender?: 'male' | 'female' | 'nonbinary'): string {
  if (gender === 'female') return 'her';
  if (gender === 'male') return 'his';
  return 'their';
}

function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

const WENT_WRONG_REASONS = ['Too Complicated', 'Too many dishes', "I'd modify it"];

// ── shared sub-components ─────────────────────────────────────────────────────

function ModalOverlay({
  children,
  onBackdropClick,
}: {
  children: React.ReactNode;
  onBackdropClick: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onBackdropClick}
    >
      <div
        className="bg-neutral-primary w-full max-w-[326px] rounded-[16px] p-4 flex flex-col gap-4 max-h-[88dvh] overflow-y-auto drop-shadow-[0px_30px_40px_rgba(44,2,56,0.16),0px_4px_7px_rgba(44,2,56,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="shrink-0 flex items-center justify-center size-9 rounded-full cursor-pointer outline-none text-neutral-secondary"
      aria-label="Close"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M15 5L5 15M5 5l10 10"
          stroke="currentColor"
          strokeWidth="1.667"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function EarlLayers({ width, height }: { width: number; height: number }) {
  return (
    <div className="relative shrink-0" style={{ width, height }}>
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
  );
}

function EarlCircle({ size }: { size: 'lg' | 'sm' }) {
  if (size === 'sm') {
    return (
      <div className="size-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
        <EarlLayers width={22} height={24} />
      </div>
    );
  }
  return (
    <div className="size-24 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
      <EarlLayers width={66} height={72} />
    </div>
  );
}

function CheckMark() {
  return (
    <div className="size-4 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M2 5l2.5 2.5L8 3"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Chip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-between w-full px-6 h-[53px] rounded-[16px] border-2 cursor-pointer outline-none text-left transition-colors ${
        checked
          ? 'border-brand-primary bg-brand-quinary'
          : 'border-neutral-secondary bg-neutral-primary'
      }`}
    >
      <span className="font-picky-sans font-normal text-[14px] text-neutral-primary leading-[1.5]">
        {label}
      </span>
      {checked && <CheckMark />}
    </button>
  );
}

function CommentInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center px-6 h-[53px] rounded-[16px] border-2 border-neutral-secondary bg-neutral-primary">
      <input
        type="text"
        placeholder="Add a comment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-picky-sans font-normal text-[14px] text-neutral-primary w-full outline-none bg-transparent placeholder:text-neutral-tertiary"
      />
    </div>
  );
}

function MemberBtn({
  initials,
  name,
  avatarColor,
  selected,
  onToggle,
}: {
  initials: string;
  name: string;
  avatarColor: 'purple' | 'blue' | 'orange' | 'green';
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex flex-col items-center gap-2 cursor-pointer outline-none w-12"
    >
      <div className="relative">
        <Avatar initials={initials} color={avatarColor} size={48} />
        {selected && (
          <div className="absolute -bottom-1 -right-1">
            <CheckMark />
          </div>
        )}
      </div>
      <span className="font-picky-sans font-bold text-[12px] text-neutral-secondary leading-[1.4] text-center truncate max-w-[48px]">
        {name.split(' ')[0]}
      </span>
    </button>
  );
}

function PrimaryBtn({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[37px] rounded-full font-picky-sans font-semibold text-[14px] leading-[1.5] cursor-pointer outline-none disabled:cursor-default transition-colors bg-brand-primary text-brand-inverse disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-picky-sans font-semibold text-[14px] text-brand-primary cursor-pointer outline-none h-[21px]"
    >
      {label}
    </button>
  );
}

// ── types ─────────────────────────────────────────────────────────────────────

type Step = 'rating' | 'presence' | 'positive' | 'negative' | 'why' | 'confirmation';

type S = {
  step: Step;
  stars: number;
  hovered: number;
  presentMemberIds: string[];
  likedMemberIds: string[];
  dislikedMemberIds: string[];
  wentWrongReasons: string[];
  positiveComment: string;
  negativeComment: string;
  perMemberReasons: Record<string, string[]>;
  perMemberComments: Record<string, string>;
  whyIdx: number;
};

export type MealRatingModalProps = {
  recipeId: string;
  dayName: string;
  mealType: string;
  onClose: () => void;
};

// ── modal ─────────────────────────────────────────────────────────────────────

export function MealRatingModal({ recipeId, dayName, mealType, onClose }: MealRatingModalProps) {
  const { recipes, familyMembers, setMealRating } = usePickyStore();
  const recipe = recipes[recipeId];

  const defaultPresent = familyMembers
    .filter((m) => m.role !== 'Baby')
    .map((m) => m.id);

  const [s, setS] = useState<S>({
    step: 'rating',
    stars: 0,
    hovered: 0,
    presentMemberIds: defaultPresent,
    likedMemberIds: [],
    dislikedMemberIds: [],
    wentWrongReasons: [],
    positiveComment: '',
    negativeComment: '',
    perMemberReasons: {},
    perMemberComments: {},
    whyIdx: 0,
  });

  const upd = (patch: Partial<S>) => setS((prev) => ({ ...prev, ...patch }));

  const displayStars = s.hovered || s.stars;
  const mealTypeLower = mealType.charAt(0) + mealType.slice(1).toLowerCase();
  const dateLabel = dayName ? `${dayName}'s ${mealTypeLower}` : 'Past Meal';
  const recipeName = recipe?.name ?? 'this meal';
  const presentMembers = familyMembers.filter((m) => s.presentMemberIds.includes(m.id));

  function handleCommit() {
    const rating: MealRating = {
      mealId: recipeId,
      date: new Date().toISOString(),
      stars: s.stars,
      presentMemberIds: s.presentMemberIds,
      likedMemberIds: s.likedMemberIds,
      dislikedMemberIds: s.dislikedMemberIds,
      wentWrongReasons: s.wentWrongReasons,
      perMemberReasons: s.perMemberReasons,
      perMemberComments: s.perMemberComments,
      positiveComment: s.positiveComment,
      negativeComment: s.negativeComment,
    };
    setMealRating(recipeId, rating);
    onClose();
  }

  // ── Step 1: Rating ────────────────────────────────────────────────────────

  if (s.step === 'rating') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-start">
          <div className="flex-1 flex justify-center pl-9">
            <EarlCircle size="lg" />
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5] text-center">
            How was...
          </span>
          <span className="font-picky-hand font-semibold text-[20px] text-neutral-primary leading-[1.2] text-center">
            {recipeName}
          </span>
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5] text-center">
            {dateLabel}
          </span>
        </div>
        <div
          className="flex items-center justify-center gap-4"
          onMouseLeave={() => upd({ hovered: 0 })}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => upd({ stars: n })}
              onMouseEnter={() => upd({ hovered: n })}
              className="shrink-0 cursor-pointer outline-none"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill={n <= displayStars ? '#8c01b3' : '#ece8ed'}
              >
                <path d="M12 2l2.887 6.163L22 9.27l-5 4.897 1.18 6.905L12 17.77l-6.18 3.302L7 14.167 2 9.27l7.113-1.107L12 2Z" />
              </svg>
            </button>
          ))}
        </div>
        <div className="pt-2">
          <PrimaryBtn
            label="Continue"
            disabled={s.stars === 0}
            onClick={() => upd({ step: 'presence' })}
          />
        </div>
      </ModalOverlay>
    );
  }

  // ── Step 2: Presence ──────────────────────────────────────────────────────

  if (s.step === 'presence') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-center justify-between">
          <EarlCircle size="sm" />
          <CloseBtn onClose={onClose} />
        </div>
        <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
          Who was present?
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
            Select family members
          </span>
          <div className="flex flex-wrap gap-3">
            {familyMembers.map((m) => (
              <MemberBtn
                key={m.id}
                initials={m.initials}
                name={m.name}
                avatarColor={m.avatarColor}
                selected={s.presentMemberIds.includes(m.id)}
                onToggle={() => upd({ presentMemberIds: toggleArr(s.presentMemberIds, m.id) })}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <PrimaryBtn
            label="Continue"
            disabled={s.presentMemberIds.length === 0}
            onClick={() => {
              if (s.stars >= 4) {
                upd({ step: 'positive', likedMemberIds: [...s.presentMemberIds] });
              } else {
                upd({ step: 'negative', dislikedMemberIds: [] });
              }
            }}
          />
          <div className="flex justify-center">
            <GhostBtn
              label="Undo"
              onClick={() => upd({ step: 'rating', presentMemberIds: defaultPresent })}
            />
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step 3a: Positive ─────────────────────────────────────────────────────

  if (s.step === 'positive') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EarlCircle size="sm" />
            <span className="font-picky-sans font-normal text-[16px] leading-[1.5] text-success-primary">
              Nice! 🎉
            </span>
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
          Tell me more
        </span>
        <CommentInput
          value={s.positiveComment}
          onChange={(v) => upd({ positiveComment: v })}
        />
        <div className="flex flex-col gap-2">
          <span className="font-picky-sans font-semibold text-[18px] text-neutral-primary leading-[1.2]">
            Who liked it?
          </span>
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
            Select family members
          </span>
          <div className="flex flex-wrap gap-3">
            {presentMembers.map((m) => (
              <MemberBtn
                key={m.id}
                initials={m.initials}
                name={m.name}
                avatarColor={m.avatarColor}
                selected={s.likedMemberIds.includes(m.id)}
                onToggle={() => upd({ likedMemberIds: toggleArr(s.likedMemberIds, m.id) })}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <PrimaryBtn label="Continue" onClick={() => upd({ step: 'confirmation' })} />
          <div className="flex justify-center">
            <GhostBtn label="Back" onClick={() => upd({ step: 'presence' })} />
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step 3b: Negative ─────────────────────────────────────────────────────

  if (s.step === 'negative') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EarlCircle size="sm" />
            <span className="font-picky-sans font-normal text-[16px] leading-[1.5] text-[#ab6005]">
              Ah, that's okay!
            </span>
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
          Who didn't like it?
        </span>
        <div className="flex flex-wrap gap-3">
          {presentMembers.map((m) => (
            <MemberBtn
              key={m.id}
              initials={m.initials}
              name={m.name}
              avatarColor={m.avatarColor}
              selected={s.dislikedMemberIds.includes(m.id)}
              onToggle={() =>
                upd({ dislikedMemberIds: toggleArr(s.dislikedMemberIds, m.id) })
              }
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <PrimaryBtn
            label="Continue"
            onClick={() => {
              if (s.dislikedMemberIds.length > 0) {
                upd({ step: 'why', whyIdx: 0 });
              } else {
                upd({ step: 'confirmation' });
              }
            }}
          />
          <div className="flex justify-center">
            <GhostBtn label="Back" onClick={() => upd({ step: 'presence' })} />
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step 4: Per-person why ────────────────────────────────────────────────

  if (s.step === 'why') {
    const dislikedMembers = familyMembers.filter((m) => s.dislikedMemberIds.includes(m.id));
    const currentMember = dislikedMembers[s.whyIdx];
    if (!currentMember) return null;

    const pron = derivePronoun(currentMember.gender);
    const firstName = currentMember.name.split(' ')[0];
    const WHY_REASONS = [
      '🌶️ Too spicy',
      "😬 Didn't like the texture",
      '🍽️ Not filling enough',
      `🤷 Just not ${pron} thing`,
    ];
    const currentReasons = s.perMemberReasons[currentMember.id] ?? [];
    const currentComment = s.perMemberComments[currentMember.id] ?? '';
    const isLast = s.whyIdx === dislikedMembers.length - 1;

    return (
      <ModalOverlay onBackdropClick={onClose}>
        {/* Earl nudge banner */}
        <div className="flex items-start gap-2">
          <div className="bg-brand-tertiary rounded-[8px] p-2 flex items-center gap-3 flex-1">
            <EarlCircle size="sm" />
            <span className="font-picky-sans font-normal text-[16px] text-brand-primary leading-[1.5] flex-1">
              This helps me find better meals for {firstName} next time!
            </span>
          </div>
          <CloseBtn onClose={onClose} />
        </div>

        {/* Member context row */}
        <div className="flex items-center gap-3">
          <Avatar
            initials={currentMember.initials}
            color={currentMember.avatarColor}
            size={48}
          />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-picky-sans font-semibold text-[18px] text-neutral-primary leading-[1.5]">
                {firstName}
              </span>
              <span className="bg-[rgba(236,232,237,0.75)] rounded-full px-2 py-0.5 text-[12px] font-picky-sans font-normal text-neutral-primary leading-[1.4] shrink-0">
                Didn't like
              </span>
            </div>
            <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5] truncate">
              {recipeName} · {dateLabel}
            </span>
          </div>
        </div>

        <span className="font-picky-hand font-semibold text-[24px] text-neutral-primary leading-[1.2]">
          Why didn't {firstName} like it?
        </span>

        <div className="flex flex-col gap-2">
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
            Pick all that apply
          </span>
          {WHY_REASONS.map((reason) => (
            <Chip
              key={reason}
              label={reason}
              checked={currentReasons.includes(reason)}
              onToggle={() => {
                const next = toggleArr(currentReasons, reason);
                upd({
                  perMemberReasons: { ...s.perMemberReasons, [currentMember.id]: next },
                });
              }}
            />
          ))}
        </div>

        <CommentInput
          value={currentComment}
          onChange={(v) =>
            upd({ perMemberComments: { ...s.perMemberComments, [currentMember.id]: v } })
          }
        />

        <div className="flex flex-col gap-3 pt-2">
          <PrimaryBtn
            label="Continue"
            onClick={() => {
              if (isLast) {
                upd({ step: 'confirmation' });
              } else {
                upd({ whyIdx: s.whyIdx + 1 });
              }
            }}
          />
          <div className="flex justify-center">
            <GhostBtn
              label="Back"
              onClick={() => {
                if (s.whyIdx === 0) {
                  upd({ step: 'negative' });
                } else {
                  upd({ whyIdx: s.whyIdx - 1 });
                }
              }}
            />
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step 5: Confirmation ─────────────────────────────────────────────────

  const summaryLines: string[] = [];
  const presentNames = familyMembers
    .filter((m) => s.presentMemberIds.includes(m.id))
    .map((m) => m.name.split(' ')[0]);
  if (presentNames.length > 0) {
    summaryLines.push(`👨‍👩‍👧 ${presentNames.join(', ')} had ${recipeName} for ${mealTypeLower}`);
  }
  if (s.stars >= 4 && s.likedMemberIds.length > 0) {
    const names = familyMembers
      .filter((m) => s.likedMemberIds.includes(m.id))
      .map((m) => m.name.split(' ')[0]);
    summaryLines.push(`💜 ${names.join(', ')} loved it`);
  }
  if (s.stars < 4 && s.dislikedMemberIds.length > 0) {
    const names = familyMembers
      .filter((m) => s.dislikedMemberIds.includes(m.id))
      .map((m) => m.name.split(' ')[0]);
    summaryLines.push(`😞 ${names.join(', ')} didn't love it`);
  }
  if (s.wentWrongReasons.length > 0) {
    summaryLines.push(`📋 ${s.wentWrongReasons.join(', ')}`);
  }

  return (
    <ModalOverlay onBackdropClick={handleCommit}>
      <div className="flex items-start">
        <div className="flex-1 flex justify-center pl-9">
          <EarlCircle size="lg" />
        </div>
        <CloseBtn onClose={handleCommit} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
          Got it, I'll remember that!
        </span>
        <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
          Here's what I'm taking notes on...
        </span>
        {summaryLines.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            {summaryLines.map((line, i) => (
              <p
                key={i}
                className="font-picky-sans font-normal text-[14px] text-neutral-primary leading-[1.5]"
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center pt-2">
        <button
          onClick={handleCommit}
          className="font-picky-sans font-semibold text-[14px] text-brand-primary cursor-pointer outline-none"
        >
          Done
        </button>
      </div>
    </ModalOverlay>
  );
}
