import type { ReactNode } from "react";

type NavTab = "home" | "planner" | "discover" | "family";

type BottomNavProps = {
  activeTab?: NavTab;
  className?: string;
};

// Inline SVG icons — stroke="currentColor" so color is set by parent CSS `color`
function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0">
      <path d="M3 12H5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V12H21L12 3L3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V15C9 14.4696 9.21071 13.9609 9.58579 13.5858C9.96086 13.2107 10.4696 13 11 13H13C13.5304 13 14.0391 13.2107 14.4142 13.5858C14.7893 13.9609 15 14.4696 15 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlannerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0">
      <path d="M16 3V7M8 3V7M4 11H20M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 15H10V17H8V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0">
      <path d="M4.11566 15.009L15.9547 15M9.95466 1C11.8727 1 13.4747 2.35 13.8647 4.151C14.3718 4.01377 14.9009 3.97776 15.4219 4.04503C15.943 4.11231 16.4456 4.28154 16.9012 4.54308C17.3568 4.80462 17.7565 5.15333 18.0773 5.56931C18.3982 5.9853 18.6339 6.4604 18.7712 6.9675C18.9084 7.4746 18.9444 8.00376 18.8771 8.52478C18.8099 9.04579 18.6406 9.54846 18.3791 10.0041C18.1175 10.4597 17.7688 10.8593 17.3528 11.1802C16.9369 11.501 16.4618 11.7368 15.9547 11.874V19H3.95466V11.874C3.44756 11.7366 2.97248 11.5007 2.55655 11.1798C2.14062 10.8588 1.79198 10.4591 1.53054 10.0034C1.26909 9.54766 1.09997 9.04492 1.03281 8.52385C0.965663 8.00279 1.0018 7.4736 1.13916 6.9665C1.27653 6.4594 1.51242 5.98432 1.83339 5.56839C2.15435 5.15246 2.5541 4.80382 3.0098 4.54237C3.46551 4.28093 3.96824 4.1118 4.48931 4.04465C5.01037 3.9775 5.53956 4.01364 6.04666 4.151C6.2405 3.25857 6.73388 2.45933 7.44481 1.88611C8.15574 1.31289 9.04142 1.0002 9.95466 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0">
      <path d="M8 21V20C8 19.4696 8.21071 18.9609 8.58579 18.5858C8.96086 18.2107 9.46957 18 10 18H14C14.5304 18 15.0391 18.2107 15.4142 18.5858C15.7893 18.9609 16 19.4696 16 20V21M17 10H19C19.5304 10 20.0391 10.2107 20.4142 10.5858C20.7893 10.9609 21 11.4696 21 12V13M3 13V12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96086 10.2107 4.46957 10 5 10H7M10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13ZM15 5C15 5.53043 15.2107 6.03914 15.5858 6.41421C15.9609 6.78929 16.4696 7 17 7C17.5304 7 18.0391 6.78929 18.4142 6.41421C18.7893 6.03914 19 5.53043 19 5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3C16.4696 3 15.9609 3.21071 15.5858 3.58579C15.2107 3.96086 15 4.46957 15 5ZM5 5C5 5.53043 5.21071 6.03914 5.58579 6.41421C5.96086 6.78929 6.46957 7 7 7C7.53043 7 8.03914 6.78929 8.41421 6.41421C8.78929 6.03914 9 5.53043 9 5C9 4.46957 8.78929 3.96086 8.41421 3.58579C8.03914 3.21071 7.53043 3 7 3C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BottomNav({ activeTab = "home", className }: BottomNavProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 flex h-[93px] items-start border-t border-neutral-primary bg-neutral-primary pb-4 ${className ?? ""}`}
    >
      <NavButton icon={<HomeIcon />} label="Home" isActive={activeTab === "home"} href="/" />
      <NavButton icon={<PlannerIcon />} label="Planner" isActive={activeTab === "planner"} href="/planner" />

      {/* Ask Earl — center FAB column; label pinned to bottom matching NavButton baseline */}
     <div className="relative flex flex-1 flex-col h-full items-center justify-center min-w-[60px] gap-1">
        <a href="/earl" className="absolute left-1/2 -translate-x-1/2 -top-5 flex items-center justify-center size-[52.813px] rounded-full bg-brand-primary drop-shadow-[0px_20px_25px_rgba(44,2,56,0.09),0px_4px_7px_rgba(44,2,56,0.15)] cursor-pointer p-2">
          {/* 6-layer Earl Logo — exact Figma layer structure, 36×40px container */}
          <div className="h-[40px] relative shrink-0 w-[36px]">
            <div className="absolute inset-[2.49%_44.71%_15.81%_2.69%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/earl-highlight.svg" />
            </div>
            <div className="absolute inset-[3.9%_10.71%_7.81%_6.81%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/earl-facee.svg" />
            </div>
            <div className="absolute inset-[36.57%_2.6%_2.45%_5.54%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/earl-shadow.svg" />
            </div>
            <div className="absolute inset-[53.54%_24.84%_23.27%_25.09%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/earl-face.svg" />
            </div>
            <div className="absolute inset-[23.04%_21.85%_54.89%_58.91%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/earl-crease.svg" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/earl-logo.svg" />
          </div>
        </a>
        <div className="size-6 shrink-0" />
        <span className="font-picky-sans font-regular text-[12px] leading-[1.4] text-neutral-secondary whitespace-nowrap">
          Ask Earl
        </span>
      </div>

      <NavButton icon={<DiscoverIcon />} label="Discover" isActive={activeTab === "discover"} href="/discover" />
      <NavButton icon={<FamilyIcon />} label="My Family" isActive={activeTab === "family"} href="/family" />
    </div>
  );
}

function NavButton({
  icon,
  label,
  isActive,
  href = "#",
}: {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  href?: string;
}) {
  return (
    <a
      href={href}
      className={`flex flex-1 flex-col items-center justify-center gap-1 min-w-[60px] h-full p-2 cursor-pointer transition-colors hover:bg-brand-tertiary hover:rounded-[4px] hover:text-brand-primary ${
        isActive ? "text-brand-primary" : "text-neutral-tertiary"
      }`}
    >
      {icon}
      <span className="font-picky-sans font-normal text-[10px] leading-[1.4] whitespace-nowrap">
        {label}
      </span>
    </a>
  );
}
