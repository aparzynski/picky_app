import Image from "next/image";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between h-11 px-6 shrink-0 bg-neutral-primary">
      <span
        className="font-semibold text-[14px] leading-5 tracking-[-0.15px] text-neutral-primary"
        style={{ fontFamily: "Inter, -apple-system, system-ui, sans-serif" }}
      >
        9:41
      </span>
      <div className="flex items-center gap-1">
        <div className="relative size-4">
          <Image src="/assets/status-signal.svg" alt="" fill className="object-contain" />
        </div>
        <div className="relative size-4">
          <Image src="/assets/status-wifi.svg" alt="" fill className="object-contain" />
        </div>
        <div className="relative size-5">
          <Image src="/assets/status-battery.svg" alt="" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
