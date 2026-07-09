// Shared background for the welcome screen and the onboarding completion screen.
// Gradient: 13-stop linear from Figma frame 890:14054.
// OnionRings: approximation of the "Onion Rings" WebGPU shader fill —
//   center=(16.67%,72.32%) in a 432×941 frame → (72px,681px),
//   COLOR_BURN at 40% opacity.

export const WELCOME_GRADIENT =
  'linear-gradient(180deg, rgb(245,235,255) 0%, rgb(246,237,255) 8.3333%, rgb(247,238,255) 16.667%, rgb(247,240,255) 25%, rgb(248,242,255) 33.333%, rgb(249,243,255) 41.667%, rgb(250,245,255) 50%, rgb(251,247,255) 58.333%, rgb(252,248,255) 66.667%, rgb(252,250,255) 75%, rgb(253,252,255) 83.333%, rgb(254,253,255) 91.667%, rgb(255,255,255) 100%)';

export function OnionRingsBackground() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full pointer-events-none"
      viewBox="0 0 432 941"
      preserveAspectRatio="xMidYMid slice"
      overflow="visible"
      style={{ mixBlendMode: 'color-burn', opacity: 0.4 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="onion-rings-blur"
          x="-2000"
          y="-2000"
          width="5000"
          height="5000"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>
      <g filter="url(#onion-rings-blur)">
        <circle cx="72" cy="681" r="680" fill="#DEA7ED" fillOpacity="0.9" />
        <circle cx="72" cy="681" r="718" fill="none" stroke="#48015C" strokeWidth="76" strokeOpacity="0.85" />
        <circle cx="72" cy="681" r="1096" fill="none" stroke="#C870E0" strokeWidth="680" strokeOpacity="0.65" />
        <circle cx="72" cy="681" r="1474" fill="none" stroke="#48015C" strokeWidth="76" strokeOpacity="0.5" />
        <circle cx="72" cy="681" r="1852" fill="none" stroke="#C060D8" strokeWidth="680" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}
