'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePickyStore } from '@/store/usePickyStore';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { MultiSelectChip } from '@/components/MultiSelectChip';
import { Button } from '@/components/Button';
import { Tab } from '@/components/Tab';

// ─── Copy constants (from Figma frames) ──────────────────────────────────────

const EARL_MESSAGES: Record<string, string> = {
  '1': "Hi there! 👋 I'm Earl, your personal meal planning assistant. What should I call you?",
  '2': 'Hi {name}! Please enter your age and gender.',
  '3': "Great! Now, who else are we feeding? Add your family members so I can personalize your meal plans.",
  '4': 'What are you hoping to get some help with? Select all that apply.',
  '5': "Does anyone have allergies or dietary restrictions? I'll make sure to avoid those ingredients.",
  '6': "Are there any foods that family members don't like?",
  '7': 'How much time do you usually have to cook on a weeknight?',
  '8': 'Almost done! How do you like to cook?',
};

const GOALS = [
  'Getting dinner on the table faster',
  'Dealing with picky eaters',
  'Eating healthier',
  'Trying new foods',
  'Reducing food waste',
  'Saving money on groceries',
  'Getting out of a meal rut',
];

const ALLERGIES = [
  'Dairy', 'Eggs', 'Peanuts', 'Tree Nuts', 'Soy',
  'Wheat', 'Fish', 'Shellfish', 'Gluten', 'Sesame',
];

const DISLIKES = [
  'Mushrooms', 'Brussels Sprouts', 'Olives', 'Onions', 'Eggplant',
  'Anchovies', 'Blue Cheese', 'Cilantro', 'Liver',
];

const COOK_TIMES = [
  { label: 'Under 20 min' },
  { label: '30 min' },
  { label: '45 min' },
  { label: '1 hour' },
  { label: 'It varies' },
];

const COOK_STYLES = [
  { label: 'I love leftovers', subtitle: 'cook once eat twice' },
  { label: 'Fewer dishes', subtitle: 'quick and simple' },
  { label: 'A mix of both' },
];

const GENDERS = ['Man', 'Woman', 'Prefer not to say'];

// ─── Step 1: Name ─────────────────────────────────────────────────────────────

function Step1() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();

  return (
    <OnboardingLayout
      step={1}
      earlMessage={EARL_MESSAGES['1']}
      footer={
        <Button
          variant="primary"
          size="lg"
          pill
          disabled={!onboarding.name.trim()}
          onClick={() => router.push('/onboarding/2')}
          className="w-full"
        >
          Next
        </Button>
      }
    >
      <input
        type="text"
        placeholder="Your Name"
        value={onboarding.name}
        onChange={(e) => setOnboardingField('name', e.target.value)}
        className="w-full px-4 py-3.5 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[15px] leading-[1.5] text-neutral-primary placeholder:text-neutral-tertiary outline-none focus:border-brand-primary transition-colors"
      />
    </OnboardingLayout>
  );
}

// ─── Step 2: Age + Gender ─────────────────────────────────────────────────────

function Step2() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();
  const [genderOpen, setGenderOpen] = useState(false);
  const canProceed = onboarding.age.trim() !== '' && onboarding.gender !== '';

  return (
    <OnboardingLayout
      step={2}
      earlMessage={EARL_MESSAGES['2'].replace('{name}', onboarding.name || 'there')}
      onBack={() => router.push('/onboarding/1')}
      footer={
        <Button
          variant="primary"
          size="lg"
          pill
          disabled={!canProceed}
          onClick={() => router.push('/onboarding/3')}
          className="w-full"
        >
          Next
        </Button>
      }
    >
      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Age"
          value={onboarding.age}
          onChange={(e) => setOnboardingField('age', e.target.value)}
          className="flex-1 px-4 py-3.5 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[15px] leading-[1.5] text-neutral-primary placeholder:text-neutral-tertiary outline-none focus:border-brand-primary transition-colors"
        />
        <div className="relative flex-[1.4]">
          <button
            onClick={() => setGenderOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[15px] leading-[1.5] cursor-pointer outline-none focus:border-brand-primary transition-colors"
          >
            <span className={onboarding.gender ? 'text-neutral-primary' : 'text-neutral-tertiary'}>
              {onboarding.gender || 'Gender'}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-neutral-secondary">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {genderOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-primary rounded-[12px] border border-neutral-primary shadow-lg z-10 overflow-hidden">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  onClick={() => { setOnboardingField('gender', g); setGenderOpen(false); }}
                  className="w-full text-left px-4 py-3 font-picky-sans font-normal text-[14px] text-neutral-primary hover:bg-neutral-secondary transition-colors cursor-pointer"
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 3: Family members ───────────────────────────────────────────────────

function Step3() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();
  const [form, setForm] = useState({ name: '', age: '', gender: '' });
  const [genderOpen, setGenderOpen] = useState(false);

  function addMember() {
    if (!form.name.trim()) return;
    setOnboardingField('addedMembers', [
      ...onboarding.addedMembers,
      { name: form.name, age: form.age, gender: form.gender },
    ]);
    setForm({ name: '', age: '', gender: '' });
  }

  function removeMember(idx: number) {
    setOnboardingField(
      'addedMembers',
      onboarding.addedMembers.filter((_, i) => i !== idx),
    );
  }

  return (
    <OnboardingLayout
      step={3}
      earlMessage={EARL_MESSAGES['3']}
      onBack={() => router.push('/onboarding/2')}
      footer={
        <>
          <Button
            variant="primary"
            size="lg"
            pill
            disabled={onboarding.addedMembers.length === 0}
            onClick={() => router.push('/onboarding/4')}
            className="w-full"
          >
            Next
          </Button>
          <button
            onClick={() => router.push('/onboarding/4')}
            className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-1"
          >
            It&apos;s Just Me
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Add member form */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="flex-1 px-3 py-3 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[14px] text-neutral-primary placeholder:text-neutral-tertiary outline-none focus:border-brand-primary transition-colors"
          />
          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            className="w-16 px-3 py-3 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[14px] text-neutral-primary placeholder:text-neutral-tertiary outline-none focus:border-brand-primary transition-colors"
          />
          <div className="relative">
            <button
              onClick={() => setGenderOpen((o) => !o)}
              className="flex items-center gap-1 px-3 py-3 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[14px] cursor-pointer outline-none focus:border-brand-primary transition-colors whitespace-nowrap"
            >
              <span className={form.gender ? 'text-neutral-primary' : 'text-neutral-tertiary'}>
                {form.gender || 'Gender'}
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-neutral-secondary">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {genderOpen && (
              <div className="absolute top-full right-0 mt-1 bg-neutral-primary rounded-[12px] border border-neutral-primary shadow-lg z-10 w-[160px] overflow-hidden">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setForm((f) => ({ ...f, gender: g })); setGenderOpen(false); }}
                    className="w-full text-left px-4 py-3 font-picky-sans font-normal text-[13px] text-neutral-primary hover:bg-neutral-secondary transition-colors cursor-pointer"
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          pill={false}
          disabled={!form.name.trim()}
          onClick={addMember}
          className="w-full rounded-[12px]"
        >
          Add
        </Button>

        {/* Added members list */}
        {onboarding.addedMembers.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {onboarding.addedMembers.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-[12px] border border-neutral-primary bg-neutral-primary"
              >
                <div>
                  <span className="font-picky-sans font-semibold text-[14px] text-neutral-primary">
                    {m.name}
                  </span>
                  {(m.age || m.gender) && (
                    <span className="font-picky-sans font-normal text-[13px] text-neutral-tertiary ml-2">
                      {[m.age && `Age ${m.age}`, m.gender].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeMember(i)}
                  aria-label={`Remove ${m.name}`}
                  className="text-neutral-tertiary hover:text-neutral-primary cursor-pointer p-1"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 4: Goals ────────────────────────────────────────────────────────────

function Step4() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();

  function toggle(goal: string) {
    const next = onboarding.goals.includes(goal)
      ? onboarding.goals.filter((g) => g !== goal)
      : [...onboarding.goals, goal];
    setOnboardingField('goals', next);
  }

  return (
    <OnboardingLayout
      step={4}
      earlMessage={EARL_MESSAGES['4']}
      onBack={() => router.push('/onboarding/3')}
      footer={
        <Button
          variant="primary"
          size="lg"
          pill
          disabled={onboarding.goals.length === 0}
          onClick={() => router.push('/onboarding/5')}
          className="w-full"
        >
          Next
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {GOALS.map((goal) => (
          <MultiSelectChip
            key={goal}
            label={goal}
            selected={onboarding.goals.includes(goal)}
            onClick={() => toggle(goal)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 5: Allergies ────────────────────────────────────────────────────────

function Step5() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();
  const allMembers = [onboarding.name || 'Me', ...onboarding.addedMembers.map((m) => m.name)];
  const [activeTab, setActiveTab] = useState(0);
  const [customInput, setCustomInput] = useState('');

  const activeMember = allMembers[activeTab] ?? '';
  const selected: string[] = onboarding.allergiesPerMember[activeMember] ?? [];

  function toggle(item: string) {
    const next = selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item];
    setOnboardingField('allergiesPerMember', { ...onboarding.allergiesPerMember, [activeMember]: next });
  }

  function addCustom() {
    const val = customInput.trim();
    if (!val) return;
    if (!selected.includes(val)) {
      setOnboardingField('allergiesPerMember', {
        ...onboarding.allergiesPerMember,
        [activeMember]: [...selected, val],
      });
    }
    setCustomInput('');
  }

  return (
    <OnboardingLayout
      step={5}
      earlMessage={EARL_MESSAGES['5']}
      onBack={() => router.push('/onboarding/4')}
      footer={
        <>
          <Button
            variant="primary"
            size="lg"
            pill
            onClick={() => router.push('/onboarding/6')}
            className="w-full"
          >
            Next
          </Button>
          <button
            onClick={() => router.push('/onboarding/6')}
            className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-1"
          >
            Skip
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Member tab bar */}
        <div className="flex border-b border-neutral-primary -mx-5 px-5 overflow-x-auto">
          {allMembers.map((name, i) => (
            <Tab
              key={name}
              label={name}
              selected={activeTab === i}
              onClick={() => setActiveTab(i)}
            />
          ))}
        </div>

        {/* Allergy chips */}
        <div className="flex flex-wrap gap-2">
          {ALLERGIES.map((item) => (
            <MultiSelectChip
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggle(item)}
            />
          ))}
        </div>

        {/* Custom input */}
        <div className="flex flex-col gap-2">
          <span className="font-picky-sans font-semibold text-[13px] text-neutral-primary">
            Add other restrictions
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., lactose intolerant"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
              className="flex-1 px-4 py-2.5 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[14px] text-neutral-primary placeholder:text-neutral-tertiary outline-none focus:border-brand-primary transition-colors"
            />
            <Button
              variant="secondary"
              size="md"
              pill={false}
              disabled={!customInput.trim()}
              onClick={addCustom}
              className="rounded-[12px]"
            >
              Add
            </Button>
          </div>
          {/* Custom items added */}
          {selected.filter((s) => !ALLERGIES.includes(s)).map((s) => (
            <div key={s} className="flex items-center justify-between px-3 py-2 rounded-[12px] bg-brand-quinary">
              <span className="font-picky-sans font-normal text-[14px] text-neutral-primary">{s}</span>
              <button
                onClick={() => toggle(s)}
                aria-label={`Remove ${s}`}
                className="text-neutral-tertiary cursor-pointer p-1"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 6: Dislikes ─────────────────────────────────────────────────────────

function Step6() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();
  const allMembers = [onboarding.name || 'Me', ...onboarding.addedMembers.map((m) => m.name)];
  const [activeTab, setActiveTab] = useState(0);
  const [customInput, setCustomInput] = useState('');

  const activeMember = allMembers[activeTab] ?? '';
  const selected: string[] = onboarding.dislikesPerMember[activeMember] ?? [];

  function toggle(item: string) {
    const next = selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item];
    setOnboardingField('dislikesPerMember', { ...onboarding.dislikesPerMember, [activeMember]: next });
  }

  function addCustom() {
    const val = customInput.trim();
    if (!val) return;
    if (!selected.includes(val)) {
      setOnboardingField('dislikesPerMember', {
        ...onboarding.dislikesPerMember,
        [activeMember]: [...selected, val],
      });
    }
    setCustomInput('');
  }

  return (
    <OnboardingLayout
      step={5}
      earlMessage={EARL_MESSAGES['6']}
      onBack={() => router.push('/onboarding/5')}
      footer={
        <>
          <Button
            variant="primary"
            size="lg"
            pill
            onClick={() => router.push('/onboarding/7')}
            className="w-full"
          >
            Next
          </Button>
          <button
            onClick={() => router.push('/onboarding/7')}
            className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-1"
          >
            Skip
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Member tab bar */}
        <div className="flex border-b border-neutral-primary -mx-5 px-5 overflow-x-auto">
          {allMembers.map((name, i) => (
            <Tab
              key={name}
              label={name}
              selected={activeTab === i}
              onClick={() => setActiveTab(i)}
            />
          ))}
        </div>

        {/* Dislike chips */}
        <div className="flex flex-wrap gap-2">
          {DISLIKES.map((item) => (
            <MultiSelectChip
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggle(item)}
            />
          ))}
        </div>

        {/* Custom input */}
        <div className="flex flex-col gap-2">
          <span className="font-picky-sans font-semibold text-[13px] text-neutral-primary">
            Add other dislikes
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. pickles"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
              className="flex-1 px-4 py-2.5 rounded-[12px] border border-neutral-primary bg-neutral-primary font-picky-sans font-normal text-[14px] text-neutral-primary placeholder:text-neutral-tertiary outline-none focus:border-brand-primary transition-colors"
            />
            <Button
              variant="secondary"
              size="md"
              pill={false}
              disabled={!customInput.trim()}
              onClick={addCustom}
              className="rounded-[12px]"
            >
              Add
            </Button>
          </div>
          {selected.filter((s) => !DISLIKES.includes(s)).map((s) => (
            <div key={s} className="flex items-center justify-between px-3 py-2 rounded-[12px] bg-brand-quinary">
              <span className="font-picky-sans font-normal text-[14px] text-neutral-primary">{s}</span>
              <button
                onClick={() => toggle(s)}
                aria-label={`Remove ${s}`}
                className="text-neutral-tertiary cursor-pointer p-1"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 7: Cook time ────────────────────────────────────────────────────────

function Step7() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();

  return (
    <OnboardingLayout
      step={6}
      earlMessage={EARL_MESSAGES['7']}
      onBack={() => router.push('/onboarding/6')}
      footer={
        <Button
          variant="primary"
          size="lg"
          pill
          disabled={!onboarding.cookTime}
          onClick={() => router.push('/onboarding/8')}
          className="w-full"
        >
          Next
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {COOK_TIMES.map(({ label }) => (
          <SelectionCard
            key={label}
            label={label}
            selected={onboarding.cookTime === label}
            onClick={() => setOnboardingField('cookTime', label)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 8: Cook style + nights ─────────────────────────────────────────────

function Step8() {
  const router = useRouter();
  const { onboarding, setOnboardingField } = usePickyStore();

  function decrement() {
    setOnboardingField('nightsPerWeek', Math.max(1, onboarding.nightsPerWeek - 1));
  }
  function increment() {
    setOnboardingField('nightsPerWeek', Math.min(7, onboarding.nightsPerWeek + 1));
  }

  return (
    <OnboardingLayout
      step={7}
      earlMessage={EARL_MESSAGES['8']}
      onBack={() => router.push('/onboarding/7')}
      footer={
        <Button
          variant="primary"
          size="lg"
          pill
          disabled={!onboarding.cookStyle}
          onClick={() => router.push('/onboarding/9')}
          className="w-full"
        >
          Let&apos;s Get Cooking!
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Cook style selection */}
        <div className="flex flex-col gap-3">
          {COOK_STYLES.map(({ label, subtitle }) => (
            <SelectionCard
              key={label}
              label={label}
              subtitle={subtitle}
              selected={onboarding.cookStyle === label}
              onClick={() => setOnboardingField('cookStyle', label)}
            />
          ))}
        </div>

        {/* Nights per week stepper */}
        <div className="flex flex-col gap-2">
          <p className="font-picky-sans font-semibold text-[15px] leading-[1.4] text-neutral-primary">
            How many nights a week do you want to cook?
          </p>
          <p className="font-picky-sans font-normal text-[13px] leading-[1.4] text-neutral-tertiary">
            You can always adjust this later.
          </p>
          <div className="flex items-center justify-center gap-8 pt-2">
            <button
              onClick={decrement}
              disabled={onboarding.nightsPerWeek <= 1}
              aria-label="Decrease"
              className="font-picky-sans font-semibold text-[24px] text-brand-primary cursor-pointer disabled:text-neutral-disabled"
            >
              −
            </button>
            <span className="font-picky-hand font-semibold text-[40px] leading-none text-brand-primary w-10 text-center">
              {onboarding.nightsPerWeek}
            </span>
            <button
              onClick={increment}
              disabled={onboarding.nightsPerWeek >= 7}
              aria-label="Increase"
              className="font-picky-sans font-semibold text-[24px] text-brand-primary cursor-pointer disabled:text-neutral-disabled"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}

// ─── Step 9: Done ─────────────────────────────────────────────────────────────

function Step9() {
  const router = useRouter();
  const { completeOnboarding } = usePickyStore();

  function handlePlan() {
    completeOnboarding();
    router.push('/');
  }

  return (
    <div className="flex flex-col h-dvh bg-brand-quinary overflow-hidden items-center justify-center px-8 gap-6">
      {/* Large Earl illustration */}
      <div
        className="flex items-center justify-center rounded-full bg-brand-primary shrink-0"
        style={{ width: 96, height: 96 }}
      >
        <div className="relative" style={{ width: 66, height: 72 }}>
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

      <div className="flex flex-col gap-3 items-center text-center">
        <h1 className="font-picky-hand font-semibold text-[28px] leading-[1.2] text-brand-primary">
          You&apos;re all set! 🎉
        </h1>
        <p className="font-picky-sans font-normal text-[15px] leading-[1.6] text-neutral-secondary">
          Your family profile is ready. I&apos;ll take it from here — starting with some meal ideas
          your crew will actually eat. 🧅
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Button variant="primary" size="lg" pill onClick={handlePlan} className="w-full">
          Plan My Meals!
        </Button>
        <button
          onClick={() => router.push('/onboarding/8')}
          className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-brand-primary text-center cursor-pointer py-2"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// ─── Route dispatcher ─────────────────────────────────────────────────────────

const STEPS: Record<string, React.ComponentType> = {
  '1': Step1,
  '2': Step2,
  '3': Step3,
  '4': Step4,
  '5': Step5,
  '6': Step6,
  '7': Step7,
  '8': Step8,
  '9': Step9,
};

export default function OnboardingStepPage() {
  const params = useParams();
  const router = useRouter();
  const step = Array.isArray(params.step) ? params.step[0] : params.step;
  const StepComponent = step ? STEPS[step] : undefined;

  if (!StepComponent) {
    router.replace('/onboarding/1');
    return null;
  }

  return <StepComponent />;
}
