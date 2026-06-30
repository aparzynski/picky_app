function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.00004 12.5V13.3334C5.00004 13.9964 5.26343 14.6323 5.73227 15.1011C6.20111 15.57 6.837 15.8334 7.50004 15.8334C8.16308 15.8334 8.79897 15.57 9.26781 15.1011C9.73665 14.6323 10 13.9964 10 13.3334V12.5M5.83337 2.50004C5.83337 2.05801 6.00897 1.63409 6.32153 1.32153C6.63409 1.00897 7.05801 0.833374 7.50004 0.833374C7.94207 0.833374 8.36599 1.00897 8.67855 1.32153C8.99111 1.63409 9.16671 2.05801 9.16671 2.50004C10.1237 2.95256 10.9395 3.65698 11.5267 4.53779C12.114 5.4186 12.4504 6.4426 12.5 7.50004V10C12.5628 10.5181 12.7462 11.0143 13.0357 11.4485C13.3252 11.8827 13.7126 12.2429 14.1667 12.5H0.833374C1.28749 12.2429 1.67488 11.8827 1.96436 11.4485C2.25385 11.0143 2.43733 10.5181 2.50004 10V7.50004C2.54967 6.4426 2.88612 5.4186 3.47333 4.53779C4.06054 3.65698 4.87637 2.95256 5.83337 2.50004Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type NotificationFabProps = {
  alerts?: boolean;
  state?: "default";
  count?: number;
  className?: string;
};

export function NotificationFab({
  alerts = true,
  count = 99,
  className,
}: NotificationFabProps) {
  return (
    <div
      className={`relative flex items-center justify-center size-10 rounded-full bg-brand-tertiary drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] cursor-pointer transition-colors hover:bg-brand-quinary ${className ?? ""}`}
    >
      {/* Icon/Brand/Primary token — same in default and hover states */}
      <div className="size-5 flex items-center justify-center text-brand-primary shrink-0">
        <BellIcon />
      </div>
      {alerts && (
        <div className="absolute -bottom-px -right-0.5 size-4 rounded-full bg-error-bold flex items-center justify-center drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]">
          <span className="text-[10px] font-bold leading-none text-neutral-inverse tracking-[0.1px]">
            {Math.min(count, 99)}
          </span>
        </div>
      )}
    </div>
  );
}
