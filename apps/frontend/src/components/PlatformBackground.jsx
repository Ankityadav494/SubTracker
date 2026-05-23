import BrandLogo from "./BrandLogo";

const FLOATING_ICONS = [
  { name: "Netflix", slug: "netflix", color: "E50914", top: "6%", left: "4%", size: "lg", rotate: -12, opacity: 0.14, hideMobile: false },
  { name: "Spotify", slug: "spotify", color: "1DB954", top: "12%", left: "78%", size: "md", rotate: 8, opacity: 0.12, hideMobile: true },
  { name: "YouTube", slug: "youtube", color: "FF0000", top: "22%", left: "88%", size: "lg", rotate: 15, opacity: 0.1, hideMobile: true },
  { name: "Prime Video", slug: "amazonprime", color: "00A8E1", top: "8%", left: "42%", size: "sm", rotate: -6, opacity: 0.08, hideMobile: false },
  { name: "Disney+", slug: "disneyplus", color: "113CCF", top: "55%", left: "2%", size: "md", rotate: 10, opacity: 0.11, hideMobile: false },
  { name: "Apple Music", slug: "applemusic", color: "FA243C", top: "68%", left: "12%", size: "sm", rotate: -8, opacity: 0.1, hideMobile: true },
  { name: "PlayStation", slug: "playstation", color: "003791", top: "72%", left: "82%", size: "lg", rotate: -14, opacity: 0.12, hideMobile: true },
  { name: "Xbox", slug: "xbox", color: "107C10", top: "48%", left: "92%", size: "md", rotate: 6, opacity: 0.09, hideMobile: true },
  { name: "Notion", slug: "notion", color: "000000", top: "38%", left: "6%", size: "sm", rotate: 12, opacity: 0.08, hideMobile: false },
  { name: "GitHub", slug: "github", color: "181717", top: "85%", left: "48%", size: "md", rotate: -10, opacity: 0.1, hideMobile: false },
  { name: "Adobe", slug: "adobe", color: "FF0000", top: "28%", left: "18%", size: "md", rotate: -5, opacity: 0.09, hideMobile: true },
  { name: "ChatGPT", slug: "openai", color: "412991", top: "18%", left: "62%", size: "sm", rotate: 18, opacity: 0.11, hideMobile: true },
  { name: "Canva", slug: "canva", color: "00C4CC", top: "62%", left: "68%", size: "md", rotate: -7, opacity: 0.1, hideMobile: false },
  { name: "Slack", slug: "slack", color: "4A154B", top: "42%", left: "72%", size: "sm", rotate: 9, opacity: 0.08, hideMobile: true },
  { name: "Hulu", slug: "hulu", color: "1CE783", top: "78%", left: "28%", size: "lg", rotate: 5, opacity: 0.11, hideMobile: false },
  { name: "LinkedIn", slug: "linkedin", color: "0A66C2", top: "32%", left: "52%", size: "sm", rotate: -15, opacity: 0.07, hideMobile: true },
];

const PlatformBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-100" />
    <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl sm:h-80 sm:w-80" />
    <div className="absolute -right-16 top-1/4 h-56 w-56 rounded-full bg-blue-200/35 blur-3xl sm:h-96 sm:w-96" />
    <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-100/50 blur-3xl sm:h-72 sm:w-72" />

    {FLOATING_ICONS.map((icon) => (
      <div
        key={icon.name}
        className={`absolute scale-75 sm:scale-100 ${
          icon.hideMobile ? "hidden sm:block" : ""
        }`}
        style={{
          top: icon.top,
          left: icon.left,
          opacity: icon.opacity,
          transform: `rotate(${icon.rotate}deg)`,
        }}
      >
        <BrandLogo
          name={icon.name}
          slug={icon.slug}
          brandColor={icon.color}
          size={icon.size}
          className="shadow-lg shadow-sky-900/10 ring-2 ring-white/80"
        />
      </div>
    ))}
  </div>
);

export default PlatformBackground;
