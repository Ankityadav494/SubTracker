import { useState } from "react";
import BrandLogo from "./BrandLogo";

const BRANDS = [
  { name: "Netflix", slug: "netflix", color: "E50914" },
  { name: "Spotify", slug: "spotify", color: "1DB954" },
  { name: "Prime Video", slug: "amazonprime", color: "00A8E1" },
  { name: "YouTube", slug: "youtube", color: "FF0000" },
  { name: "Disney+", slug: "disneyplus", color: "113CCF" },
  { name: "Hulu", slug: "hulu", color: "1CE783" },
  { name: "Apple Music", slug: "applemusic", color: "FA243C" },
  { name: "PlayStation", slug: "playstation", color: "003791" },
  { name: "Xbox", slug: "xbox", color: "107C10" },
  { name: "Notion", slug: "notion", color: "000000" },
  { name: "GitHub", slug: "github", color: "181717" },
  { name: "Adobe", slug: "adobe", color: "FF0000" },
  { name: "ChatGPT", slug: "openai", color: "412991" },
  { name: "Canva", slug: "canva", color: "00C4CC" },
  { name: "Slack", slug: "slack", color: "4A154B" },
  { name: "LinkedIn", slug: "linkedin", color: "0A66C2" },
];

const TILTS = [-10, 8, -6, 12, -8, 6, -12, 10, -5, 7, -9, 11, -7, 9, -11, 5];

const BrandGrid = () => {
  const [hoveredName, setHoveredName] = useState(null);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden rounded-2xl border-2 border-sky-200 bg-white/90 p-3 shadow-[0_0_60px_-12px_rgba(14,165,233,0.25)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_80px_-8px_rgba(14,165,233,0.35)] sm:rounded-3xl sm:p-5">
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl animate-auth-glow sm:h-40 sm:w-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-blue-400/15 blur-3xl animate-auth-glow sm:h-44 sm:w-44"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />

      <p className="relative z-10 mb-3 shrink-0 text-center text-xs font-black uppercase tracking-[0.15em] text-transparent bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text sm:mb-4 sm:text-sm sm:tracking-[0.2em]">
        Your subs, one place ✦
      </p>

      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-4 place-items-center gap-1.5 sm:gap-3">
        {BRANDS.map((b, i) => {
          const isHovered = hoveredName === b.name;
          const isDimmed = hoveredName && !isHovered;

          return (
            <button
              key={b.name}
              type="button"
              className={`brand-tile group relative flex cursor-pointer items-center justify-center rounded-2xl p-0.5 outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:rounded-3xl sm:p-1 ${
                isDimmed ? "scale-90 opacity-35 blur-[0.5px]" : "opacity-100"
              } ${isHovered ? "z-20 scale-105" : "z-0"}`}
              style={{ ["--brand-tilt"]: `${TILTS[i % TILTS.length]}deg` }}
              onMouseEnter={() => setHoveredName(b.name)}
              onMouseLeave={() => setHoveredName(null)}
              onFocus={() => setHoveredName(b.name)}
              onBlur={() => setHoveredName(null)}
              aria-label={b.name}
            >
              <div
                className={`brand-tile-glow absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ease-out sm:rounded-3xl ${
                  isHovered ? "scale-[1.35] opacity-95" : "scale-90 opacity-50"
                }`}
                style={{ backgroundColor: `#${b.color}` }}
                aria-hidden
              />
              <div
                className={`brand-tile-float ${isHovered ? "brand-tile-float-paused" : ""}`}
                style={{ animationDelay: `${(i % 8) * 0.2}s` }}
              >
                <BrandLogo
                  name={b.name}
                  slug={b.slug}
                  brandColor={b.color}
                  size="hero"
                  className={`brand-tile-logo relative z-10 ring-2 transition-all duration-500 ease-out sm:ring-4 ${
                    isHovered
                      ? "rotate-0 ring-sky-300/80 shadow-[0_0_40px_rgba(14,165,233,0.45)]"
                      : "rotate-[var(--brand-tilt)] ring-slate-200/80"
                  }`}
                />
              </div>
              <span
                className={`pointer-events-none absolute -bottom-1 left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-sky-200 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-sky-700 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out sm:block sm:text-xs ${
                  isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                {b.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/** Horizontal scroll strip for mobile auth */
const BrandScroll = () => (
  <div className="w-full overflow-hidden rounded-2xl border border-sky-200 bg-white/90 p-3 shadow-md shadow-sky-900/5">
    <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-sky-600">
      Track your favorite apps
    </p>
    <div className="scrollbar-thin flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
      {BRANDS.map((b) => (
        <div
          key={b.name}
          className="flex shrink-0 snap-center flex-col items-center gap-1.5"
          aria-hidden
        >
          <BrandLogo name={b.name} slug={b.slug} brandColor={b.color} size="md" />
          <span className="max-w-[4.5rem] truncate text-[10px] font-medium text-slate-600">
            {b.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const BrandStrip = ({ variant = "grid" }) => {
  if (variant === "scroll") {
    return <BrandScroll />;
  }

  if (variant === "grid") {
    return <BrandGrid />;
  }

  const lane1 = BRANDS.slice(0, 8);
  const lane2 = BRANDS.slice(8);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-md shadow-sky-900/5">
      <p className="mb-2 text-center text-xs font-semibold uppercase text-slate-500">
        Track your favorite apps
      </p>
      <div className="scrollbar-thin flex gap-4 overflow-x-auto py-2 sm:gap-6">
        {[...lane1, ...lane1].map((b, idx) => (
          <BrandLogo key={`${b.name}-${idx}`} name={b.name} slug={b.slug} brandColor={b.color} size="md" />
        ))}
      </div>
      <div className="scrollbar-thin flex gap-4 overflow-x-auto py-2 sm:gap-6">
        {[...lane2, ...lane2].map((b, idx) => (
          <BrandLogo key={`${b.name}-2-${idx}`} name={b.name} slug={b.slug} brandColor={b.color} size="md" />
        ))}
      </div>
    </div>
  );
};

export default BrandStrip;
