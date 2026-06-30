function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type AddYourOwnRecipeProps = {
  onClick?: () => void;
};

export function AddYourOwnRecipe({ onClick }: AddYourOwnRecipeProps) {
  return (
    <div className="px-4 pt-4">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] border border-dashed border-brand-primary bg-brand-tertiary cursor-pointer text-left"
      >
        <div className="flex items-center justify-center size-8 rounded-full bg-brand-primary text-brand-inverse shrink-0">
          <PlusIcon />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p className="font-picky-sans font-semibold text-[14px] leading-[1.5] text-neutral-primary">
            Add your own recipe
          </p>
          <p className="font-picky-sans font-normal text-[12px] leading-[1.4] text-neutral-tertiary">
            Upload a photo or paste a link
          </p>
        </div>
      </button>
    </div>
  );
}
