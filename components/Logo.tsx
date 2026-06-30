import Image from "next/image";

type LogoProps = {
  type?: "mark" | "mark and word";
  className?: string;
};

export function Logo({ type = "mark and word", className }: LogoProps) {
  if (type === "mark and word") {
    return (
      <div className={`flex items-end gap-3 overflow-clip relative ${className ?? ""}`}>
        {/* Mark: 48.635 × 56px — exact Figma dimensions */}
        <div className="relative h-[56px] shrink-0" style={{ width: "48.635px" }}>
          <Image src="/assets/logo-mark.svg" alt="Picky mascot" fill className="object-contain" priority />
        </div>
        <div className="relative shrink-0" style={{ width: "92.417px", height: "48.026px" }}>
          <Image
            src="/assets/logo-wordmark.svg"
            alt="Picky"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-[175px] w-[154px] ${className ?? ""}`}>
      <Image src="/assets/logo-mark.svg" alt="Picky" fill className="object-contain" />
    </div>
  );
}
