'use client';

import { useState } from 'react';
import { usePickyStore } from '@/store/usePickyStore';
import { Button } from './Button';

// ── helpers ────────────────────────────────────────────────────────────────

function ModalOverlay({ onBackdropClick, children }: { onBackdropClick: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onBackdropClick}
    >
      <div
        className="bg-neutral-primary w-full max-w-[326px] rounded-[16px] p-4 flex flex-col gap-4 max-h-[88dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="shrink-0 flex items-center justify-center size-9 rounded-full cursor-pointer outline-none text-neutral-secondary hover:bg-neutral-secondary focus-visible:ring-2 focus-visible:ring-brand-primary"
      aria-label="Close"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function EarlCircle({ size }: { size: 'lg' | 'md' | 'sm' }) {
  const cls =
    size === 'lg' ? 'size-24 text-[32px]'
    : size === 'md' ? 'size-14 text-[24px]'
    : 'size-8 text-[14px]';
  return (
    <div className={`rounded-full bg-brand-primary flex items-center justify-center shrink-0 ${cls}`}>
      <span className="font-picky-hand font-bold text-neutral-inverse">E</span>
    </div>
  );
}

const FAMILY_LIST = [
  { id: 'S', name: 'Sarah', bg: 'bg-purple-10', text: 'text-purple-80' },
  { id: 'D', name: 'David', bg: 'bg-blue-10',   text: 'text-blue-80' },
  { id: 'M', name: 'Mia',   bg: 'bg-orange-10', text: 'text-orange-70' },
  { id: 'N', name: 'Noah',  bg: 'bg-green-10',  text: 'text-green-80' },
  { id: 'L', name: 'Lily',  bg: 'bg-orange-10', text: 'text-orange-70' },
];

function AvatarButtons({ selectedIds, onToggle }: { selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {FAMILY_LIST.map((m) => {
        const selected = selectedIds.includes(m.id);
        return (
          <button
            key={m.id}
            onClick={() => onToggle(m.id)}
            className="flex flex-col items-center gap-2 cursor-pointer outline-none"
          >
            <div className={`relative size-12 rounded-full ${m.bg} flex items-center justify-center ${selected ? 'ring-2 ring-brand-primary ring-offset-1' : ''}`}>
              <span className={`font-picky-hand font-semibold text-xl ${m.text}`}>{m.id}</span>
              {selected && (
                <div className="absolute -bottom-1 -right-1 size-4 bg-brand-primary rounded-full flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
            <span className="font-picky-sans font-bold text-[12px] text-neutral-primary leading-[1.4]">
              {m.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const NEGATIVE_OPTIONS = ['Too Complicated', 'Too many dishes', "I'd modify it"];

// ── main component ─────────────────────────────────────────────────────────

type Props = {
  recipeId: string;
  recipeName: string;
  day?: string;
  mealType?: string;
  familyIds?: string[];
  onClose: () => void;
};

export function RatingModal({ recipeId, recipeName, day, mealType, familyIds, onClose }: Props) {
  const { setRecipeRating } = usePickyStore();
  const [step, setStep] = useState<'stars' | 'present' | 'feedback' | 'done'>('stars');
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [presentIds, setPresentIds] = useState<string[]>(familyIds ?? []);
  const [feedbackIds, setFeedbackIds] = useState<string[]>([]);
  const [issueChecked, setIssueChecked] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState('');

  const isPositive = stars >= 4;
  const dateLabel = day
    ? `${day}'s ${(mealType ?? 'meal').charAt(0) + (mealType ?? 'meal').slice(1).toLowerCase()}`
    : 'Past meal';
  const displayStars = hovered || stars;

  function handleComplete() {
    setRecipeRating(recipeId, stars);
    onClose();
  }

  function togglePresent(id: string) {
    setPresentIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }

  function toggleFeedback(id: string) {
    setFeedbackIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }

  if (step === 'stars') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-start justify-between">
          <EarlCircle size="lg" />
          <CloseButton onClose={onClose} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
            How was...
          </span>
          <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
            {recipeName}
          </span>
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
            {dateLabel}
          </span>
        </div>
        <div className="flex items-center gap-4" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setStars(n)}
              onMouseEnter={() => setHovered(n)}
              className="shrink-0 cursor-pointer outline-none"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill={n <= displayStars ? '#8c01b3' : '#ece8ed'}>
                <path d="M12 2l2.887 6.163L22 9.27l-5 4.897 1.18 6.905L12 17.77l-6.18 3.302L7 14.167 2 9.27l7.113-1.107L12 2Z" />
              </svg>
            </button>
          ))}
        </div>
        <div className="pt-2">
          <Button variant="primary" size="lg" pill className="w-full" disabled={stars === 0} onClick={() => setStep('present')}>
            Continue
          </Button>
        </div>
      </ModalOverlay>
    );
  }

  if (step === 'present') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-center justify-between">
          <EarlCircle size="md" />
          <CloseButton onClose={onClose} />
        </div>
        <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
          Who was present?
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
            Select family members
          </span>
          <AvatarButtons selectedIds={presentIds} onToggle={togglePresent} />
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <Button variant="primary" size="lg" pill className="w-full" onClick={() => setStep('feedback')}>
            Continue
          </Button>
          <div className="flex justify-center">
            <button
              onClick={() => setStep('stars')}
              className="font-picky-sans font-semibold text-[14px] text-brand-primary cursor-pointer outline-none"
            >
              Undo
            </button>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  if (step === 'feedback') {
    return (
      <ModalOverlay onBackdropClick={onClose}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EarlCircle size="sm" />
            <span
              className={`font-picky-sans font-normal text-[16px] leading-[1.5] ${
                isPositive ? 'text-success-primary' : 'text-[#ab6005]'
              }`}
            >
              {isPositive ? 'Nice! 🎉' : "Ah, that's okay!"}
            </span>
          </div>
          <CloseButton onClose={onClose} />
        </div>
        <span className="font-picky-sans font-semibold text-[24px] text-neutral-primary leading-[1.2]">
          {isPositive ? 'Tell me more' : 'What went wrong?'}
        </span>
        {!isPositive && (
          <div className="flex flex-col gap-2">
            <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
              Pick all that apply
            </span>
            {NEGATIVE_OPTIONS.map((opt) => {
              const checked = issueChecked[opt] ?? false;
              return (
                <button
                  key={opt}
                  onClick={() => setIssueChecked((prev) => ({ ...prev, [opt]: !prev[opt] }))}
                  className={`flex items-center justify-between px-6 py-4 rounded-[16px] border-2 cursor-pointer outline-none text-left transition-colors ${
                    checked
                      ? 'border-brand-primary bg-brand-quinary'
                      : 'border-neutral-secondary bg-neutral-primary'
                  }`}
                >
                  <span className="font-picky-sans font-normal text-[14px] text-neutral-primary leading-[1.5]">
                    {opt}
                  </span>
                  {checked && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill="#8c01b3" />
                      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
            {isPositive ? 'Who liked it?' : "Who didn't like it?"}
          </span>
          <div className="flex flex-col gap-2">
            <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
              Select family members
            </span>
            <AvatarButtons selectedIds={feedbackIds} onToggle={toggleFeedback} />
          </div>
        </div>
        <div className="flex items-center px-6 py-4 rounded-[16px] border-2 border-neutral-secondary">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="font-picky-sans font-normal text-[14px] text-neutral-primary leading-[1.5] w-full outline-none bg-transparent placeholder:text-neutral-tertiary"
          />
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <Button variant="primary" size="lg" pill className="w-full" onClick={() => setStep('done')}>
            Continue
          </Button>
          <div className="flex justify-center">
            <button
              onClick={() => setStep('present')}
              className="font-picky-sans font-semibold text-[14px] text-brand-primary cursor-pointer outline-none"
            >
              Back
            </button>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // done
  return (
    <ModalOverlay onBackdropClick={onClose}>
      <div className="flex items-start justify-between">
        <EarlCircle size="lg" />
        <CloseButton onClose={onClose} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-picky-sans font-semibold text-[20px] text-neutral-primary leading-[1.2]">
          Got it, I'll remember that!
        </span>
        <span className="font-picky-sans font-normal text-[14px] text-neutral-secondary leading-[1.5]">
          Here's what I'm taking notes on...
        </span>
      </div>
      <div className="flex justify-center pt-2">
        <button
          onClick={handleComplete}
          className="font-picky-sans font-semibold text-[14px] text-neutral-tertiary cursor-pointer outline-none"
        >
          Dismiss
        </button>
      </div>
    </ModalOverlay>
  );
}

// ── small display-only star rater (recipe page rated state) ────────────────

export function SmallStarRater({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= stars ? '#8c01b3' : '#f5d1ff'}>
          <path d="M12 2l2.887 6.163L22 9.27l-5 4.897 1.18 6.905L12 17.77l-6.18 3.302L7 14.167 2 9.27l7.113-1.107L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
