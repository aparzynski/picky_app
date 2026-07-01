'use client';

import { useParams, useRouter } from 'next/navigation';
import { StatusBar } from '@/components/StatusBar';
import { BottomNav } from '@/components/BottomNav';

const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export default function PlannerDayIdPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const router = useRouter();
  const label = DAY_LABELS[dayId] ?? dayId;

  return (
    <div className="flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      <div className="flex items-center justify-between h-[61px] px-4 border-b border-neutral-primary shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-9 rounded-full text-neutral-secondary"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="text-[18px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
          {label}
        </span>

        <div className="size-9" />
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-disabled">
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <span className="text-[32px]">🗓️</span>
          <span className="text-[16px] font-semibold font-picky-sans text-neutral-primary leading-[1.5]">
            {label}
          </span>
          <span className="text-[14px] font-normal font-picky-sans text-neutral-tertiary leading-[1.5]">
            Day view coming soon
          </span>
        </div>
      </div>

      <BottomNav activeTab="planner" />
    </div>
  );
}
