const BRAND_MAP = {
  netflix: { slug: "netflix", color: "E50914" },
  spotify: { slug: "spotify", color: "1DB954" },
  
  // Specific compound brands MUST be declared BEFORE parent brands to prevent greedy matching
  amazonprime: { slug: "amazonprime", color: "00A8E1" },
  prime: { slug: "amazonprime", color: "00A8E1" },
  amazon: { slug: "amazonprime", color: "00A8E1" },
  
  applemusic: { slug: "applemusic", color: "FA243C" },
  apple: { slug: "apple", color: "000000" },
  
  googleplay: { slug: "googleplay", color: "00C0FF" },
  googleplaystore: { slug: "googleplay", color: "00C0FF" },
  playstore: { slug: "googleplay", color: "00C0FF" },
  google: { slug: "google", color: "4285F4" },
  
  youtube: { slug: "youtube", color: "FF0000" },
  disneyplus: { slug: "disneyplus", color: "113CCF" },
  disney: { slug: "disneyplus", color: "113CCF" },
  hotstar: { slug: "hotstar", color: "0F1014" },
  
  microsoft: { slug: "microsoft", color: "F25022" },
  office: { slug: "microsoft", color: "F25022" },
  
  playstation: { slug: "playstation", color: "003791" },
  xbox: { slug: "xbox", color: "107C10" },
  steam: { slug: "steam", color: "000000" },
  adobe: { slug: "adobe", color: "FF0000" },
  notion: { slug: "notion", color: "000000" },
  dropbox: { slug: "dropbox", color: "0061FF" },
  github: { slug: "github", color: "181717" },
  linkedin: { slug: "linkedin", color: "0A66C2" },
  coursera: { slug: "coursera", color: "0056D2" },
  udemy: { slug: "udemy", color: "A435F0" },
  canva: { slug: "canva", color: "00C4CC" },
  slack: { slug: "slack", color: "4A154B" },
  zoom: { slug: "zoom", color: "0B5CFF" },
  hulu: { slug: "hulu", color: "1CE783" },
  paramount: { slug: "paramountplus", color: "0064FF" },
  crunchyroll: { slug: "crunchyroll", color: "F47521" },
  jiocinema: { slug: "jiocinema", color: "E5007D" },
  zee5: { slug: "zee5", color: "8230FF" },
  audible: { slug: "audible", color: "F7991C" },
  perplexity: { slug: "perplexity", color: "1FB8CD" },
  openai: { slug: "openai", color: "412991" },
  chatgpt: { slug: "openai", color: "412991" },
  gaana: { slug: "gaana", color: "E72C30" },
  ganna: { slug: "gaana", color: "E72C30" },
};

const CATEGORY_FALLBACK = {
  OTT: { color: "F97316", initial: "TV" },
  Music: { color: "10B981", initial: "♪" },
  Gaming: { color: "A855F7", initial: "🎮" },
  Software: { color: "F43F5E", initial: "⌘" },
  Education: { color: "FBBF24", initial: "📚" },
  Others: { color: "78716C", initial: "★" },
};

const normalize = (name) =>
  (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const getBrand = (name, category = "Others") => {
  const key = normalize(name);
  if (!key) return { ...CATEGORY_FALLBACK[category], slug: null };

  if (BRAND_MAP[key]) return { ...BRAND_MAP[key] };

  const partial = Object.entries(BRAND_MAP).find(
    ([k]) => key.includes(k) || k.includes(key)
  );
  if (partial) return { ...partial[1] };

  return {
    slug: null,
    color: CATEGORY_FALLBACK[category]?.color || "78716C",
    initial: (name || "?").charAt(0).toUpperCase(),
  };
};

export const brandLogoUrl = (slug, color = "ffffff") =>
  slug ? `https://cdn.simpleicons.org/${slug}/${color}` : null;

export const guessDomain = (name) => {
  if (!name) return null;
  const cleaned = name.toLowerCase().trim();
  
  const customMap = {
    // Specific multi-word keywords first to prevent generic steals
    "amazon prime": "primevideo.com",
    "apple music": "music.apple.com",
    "google play": "play.google.com",
    "play store": "play.google.com",
    "youtube premium": "youtube.com",
    
    // Core brands
    netflix: "netflix.com",
    spotify: "spotify.com",
    prime: "primevideo.com",
    amazon: "amazon.com",
    youtube: "youtube.com",
    disney: "disneyplus.com",
    hotstar: "hotstar.com",
    playstation: "playstation.com",
    xbox: "xbox.com",
    adobe: "adobe.com",
    notion: "notion.so",
    chatgpt: "openai.com",
    openai: "openai.com",
    github: "github.com",
    linkedin: "linkedin.com",
    canva: "canva.com",
    zoom: "zoom.us",
    gaana: "gaana.com",
    ganna: "gaana.com",
    office: "microsoft.com",
    
    // Generic base brands last
    apple: "apple.com",
    google: "google.com",
    microsoft: "microsoft.com",
  };

  for (const [key, domain] of Object.entries(customMap)) {
    if (cleaned.includes(key)) return domain;
  }

  const base = cleaned
    .replace(/(premium|plus|pro|subscription|india|music|tv|video|play)/g, "")
    .trim()
    .replace(/[^a-z0-9]/g, "");

  return base ? `${base}.com` : null;
};
