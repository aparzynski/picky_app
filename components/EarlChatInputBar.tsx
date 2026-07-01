'use client';

// Figma: Earl Chat input bar (solo, 656:14285)
// 432×73px white bar — attach icon | text input | mic icon | purple send button

function PaperclipIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38778 15.78 1.38778C16.8415 1.38778 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32855 19.7822 5.39C19.7822 6.45145 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M12 2a3 3 0 013 3v5a3 3 0 01-6 0V5a3 3 0 013-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="23" x2="15" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type EarlChatInputBarProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function EarlChatInputBar({ value, onChange, onSend, disabled = false }: EarlChatInputBarProps) {
  const canSend = value.trim().length > 0 && !disabled;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSend) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center justify-center h-[73px] px-4 bg-neutral-primary shrink-0">
      {/* Inner container: grey pill */}
      <div className="flex items-center gap-3 w-full h-12 px-4 rounded-full bg-neutral-secondary">
        {/* Attach */}
        <button
          className="flex items-center justify-center text-neutral-tertiary shrink-0 hover:text-neutral-primary focus-visible:text-neutral-primary outline-none"
          aria-label="Attach file"
          tabIndex={-1}
        >
          <PaperclipIcon />
        </button>

        {/* Text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Earl anything..."
          disabled={disabled}
          className={[
            'flex-1 bg-transparent outline-none border-none',
            'font-picky-sans text-[14px] leading-[1.4]',
            'text-neutral-primary placeholder:text-neutral-tertiary placeholder:italic',
            disabled ? 'cursor-not-allowed' : '',
          ].join(' ')}
        />

        {/* Mic */}
        <button
          className="flex items-center justify-center text-neutral-tertiary shrink-0 hover:text-neutral-primary focus-visible:text-neutral-primary outline-none"
          aria-label="Voice input"
          tabIndex={-1}
        >
          <MicIcon />
        </button>

        {/* Send button — 32×32 purple circle */}
        <button
          onClick={canSend ? onSend : undefined}
          disabled={!canSend}
          aria-label="Send message"
          className={[
            'flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors outline-none',
            canSend
              ? 'bg-brand-primary text-neutral-inverse cursor-pointer hover:bg-brand-quarternary focus-visible:bg-brand-quarternary'
              : 'bg-neutral-disabled text-neutral-disabled cursor-not-allowed',
          ].join(' ')}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
