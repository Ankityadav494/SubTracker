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

/** Big playful grid for login / signup */
const BrandGrid = () => {
  const [hoveredName, setHoveredName] = useState(null);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden rounded-3xl border-2 border-orange-500/30 bg-stone-950/80 p-4 shadow-[0_0_60px_-12px_rgba(249,115,22,0.45)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_80px_-8px_rgba(249,115,22,0.55)] sm:p-5">
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-orange-500/25 blur-3xl animate-auth-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-6 h-44 w-44 rounded-full bg-rose-500/20 blur-3xl animate-auth-glow"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-2xl animate-auth-glow"
        style={{ animationDelay: "3s" }}
        aria-hidden
      />

      <p className="relative z-10 mb-4 shrink-0 text-center text-sm font-black uppercase tracking-[0.2em] text-transparent bg-gradient-to-r from-orange-300 via-amber-200 to-rose-400 bg-clip-text transition-all duration-500 sm:text-base">
        Your subs, one place ✦
      </p>

      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-4 place-items-center gap-2 sm:gap-3">
        {BRANDS.map((b, i) => {
          const isHovered = hoveredName === b.name;
          const isDimmed = hoveredName && !isHovered;

          return (
            <button
              key={b.name}
              type="button"
              className={`brand-tile group relative flex cursor-pointer items-center justify-center rounded-3xl p-1 outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${
                isDimmed ? "scale-90 opacity-35 blur-[0.5px]" : "opacity-100"
              } ${isHovered ? "z-20 scale-105" : "z-0"}`}
              style={{
                ["--brand-tilt"]: `${TILTS[i % TILTS.length]}deg`,
              }}
              onMouseEnter={() => setHoveredName(b.name)}
              onMouseLeave={() => setHoveredName(null)}
              onFocus={() => setHoveredName(b.name)}
              onBlur={() => setHoveredName(null)}
              aria-label={b.name}
            >
              <div
                className={`brand-tile-glow absolute inset-0 rounded-3xl blur-xl transition-all duration-500 ease-out ${
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
                  className={`brand-tile-logo relative z-10 ring-4 transition-all duration-500 ease-out ${
                    isHovered
                      ? "rotate-0 ring-orange-300/80 shadow-[0_0_40px_rgba(249,115,22,0.65)]"
                      : "rotate-[var(--brand-tilt)] ring-white/25"
                  }`}
                />
              </div>

              <span
                className={`pointer-events-none absolute -bottom-1 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-orange-500/40 bg-stone-900/95 px-2.5 py-1 text-[10px] font-bold text-orange-200 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out sm:text-xs ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
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

const BrandStrip = ({ variant = "grid" }) => {
  if (variant === "grid") {
    return <BrandGrid />;
  }

  const lane1 = BRANDS.slice(0, 8);
  const lane2 = BRANDS.slice(8);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-900/60 p-4">
      <p className="mb-2 text-center text-xs font-semibold uppercase text-stone-500">
        Track your favorite apps
      </p>
      <div className="flex gap-6 overflow-hidden py-2">
        {[...lane1, ...lane1].map((b, idx) => (
          <BrandLogo key={`${b.name}-${idx}`} name={b.name} slug={b.slug} brandColor={b.color} size="md" />
        ))}
      </div>
      <div className="flex gap-6 overflow-hidden py-2">
        {[...lane2, ...lane2].map((b, idx) => (
          <BrandLogo key={`${b.name}-2-${idx}`} name={b.name} slug={b.slug} brandColor={b.color} size="md" />
        ))}
      </div>
    </div>
  );
};

export default BrandStrip;
