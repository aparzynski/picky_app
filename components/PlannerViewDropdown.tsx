'use client';

type PlannerView = 'weekly' | 'day';

type Props = {
  currentView: PlannerView;
  todayDayId: string;
  onNavigate: (path: string) => void;
  onClose: () => void;
};

function CalendarWeekIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.333" />
      <path d="M5 1.5V4.5M11 1.5V4.5M1.5 7H14.5" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" />
      <path d="M4 10H6M7.5 10H9.5M11 10H12" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" />
      <path d="M4 12.5H6" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" />
    </svg>
  );
}

function CalendarDayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.333" />
      <path d="M5 1.5V4.5M11 1.5V4.5M1.5 7H14.5" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" />
      <rect x="4" y="9" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

const ITEMS: { id: PlannerView; label: string; icon: React.ReactNode; path: (todayId: string) => string }[] = [
  { id: 'weekly', label: 'Weekly View', icon: <CalendarWeekIcon />, path: () => '/planner' },
  { id: 'day',    label: 'Day View',    icon: <CalendarDayIcon />,  path: (id) => `/planner/${id}` },
];

export function PlannerViewDropdown({ currentView, todayDayId, onNavigate, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown panel */}
      <div className="absolute top-[61px] left-1/2 -translate-x-1/2 z-50 bg-neutral-primary border border-neutral-primary rounded-[8px] py-1 px-0.5 drop-shadow-[0px_10px_30px_rgba(44,2,56,0.11),0px_4px_14px_rgba(44,2,56,0.15)] min-w-[180px]">
        {ITEMS.filter((item) => item.id !== currentView).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.path(todayDayId));
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 font-picky-sans font-normal text-[14px] leading-[1.5] text-left rounded-[6px] text-neutral-primary cursor-pointer hover:bg-neutral-secondary transition-colors"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
