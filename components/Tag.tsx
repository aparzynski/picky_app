type TagProps = {
  label: string;
  type?: "inverse" | "inverse2";
  size?: "xs";
  iconLeft?: boolean;
  iconRight?: boolean;
  className?: string;
};

export function Tag({
  label,
  type = "inverse",
  className,
}: TagProps) {
  const isInverse2 = type === "inverse2";

  return (
    <div
      className={`flex items-center justify-center px-2 py-0.5 rounded-full ${
        isInverse2
          ? "bg-transparent-neutral-quarternary"
          : "bg-transparent-neutral-primary"
      } ${className ?? ""}`}
    >
      <span
        className={`font-picky-sans font-normal text-[12px] leading-[1.4] whitespace-nowrap ${
          isInverse2 ? "text-neutral-secondary" : "text-neutral-primary"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
