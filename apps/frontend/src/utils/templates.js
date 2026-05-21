export const SUBSCRIPTION_TEMPLATES = [
  { name: "Netflix", slug: "netflix", brandColor: "E50914", price: 649, category: "OTT", billingCycle: "monthly", aliases: ["netflix"] },
  { name: "Spotify", slug: "spotify", brandColor: "1DB954", price: 119, category: "Music", billingCycle: "monthly", aliases: ["spotify"] },
  { name: "Amazon Prime", slug: "amazonprime", brandColor: "00A8E1", price: 1499, category: "OTT", billingCycle: "yearly", aliases: ["prime", "amazon", "prime video"] },
  { name: "YouTube Premium", slug: "youtube", brandColor: "FF0000", price: 149, category: "OTT", billingCycle: "monthly", aliases: ["youtube", "yt"] },
  { name: "Disney+ Hotstar", slug: "hotstar", brandColor: "0F1014", price: 299, category: "OTT", billingCycle: "monthly", aliases: ["hotstar", "disney", "disney+"] },
  { name: "Apple Music", slug: "applemusic", brandColor: "FA243C", price: 99, category: "Music", billingCycle: "monthly", aliases: ["apple music", "apple"] },
  { name: "Microsoft 365", slug: "microsoft", brandColor: "F25022", price: 489, category: "Software", billingCycle: "monthly", aliases: ["microsoft", "office", "m365"] },
  { name: "PlayStation Plus", slug: "playstation", brandColor: "003791", price: 2999, category: "Gaming", billingCycle: "yearly", aliases: ["playstation", "psn", "ps plus"] },
  { name: "Xbox Game Pass", slug: "xbox", brandColor: "107C10", price: 699, category: "Gaming", billingCycle: "monthly", aliases: ["xbox", "game pass"] },
  { name: "Adobe Creative Cloud", slug: "adobe", brandColor: "FF0000", price: 1675, category: "Software", billingCycle: "monthly", aliases: ["adobe", "creative cloud"] },
  { name: "Notion", slug: "notion", brandColor: "000000", price: 800, category: "Software", billingCycle: "monthly", aliases: ["notion"] },
  { name: "ChatGPT Plus", slug: "openai", brandColor: "412991", price: 1650, category: "Software", billingCycle: "monthly", aliases: ["chatgpt", "openai", "gpt"] },
  { name: "Hulu", slug: "hulu", brandColor: "1CE783", price: 499, category: "OTT", billingCycle: "monthly", aliases: ["hulu"] },
  { name: "Disney+", slug: "disneyplus", brandColor: "113CCF", price: 399, category: "OTT", billingCycle: "monthly", aliases: ["disneyplus"] },
  { name: "GitHub", slug: "github", brandColor: "181717", price: 399, category: "Software", billingCycle: "monthly", aliases: ["github", "gh"] },
  { name: "Canva", slug: "canva", brandColor: "00C4CC", price: 499, category: "Software", billingCycle: "monthly", aliases: ["canva"] },
  { name: "Slack", slug: "slack", brandColor: "4A154B", price: 725, category: "Software", billingCycle: "monthly", aliases: ["slack"] },
  { name: "LinkedIn Premium", slug: "linkedin", brandColor: "0A66C2", price: 999, category: "Others", billingCycle: "monthly", aliases: ["linkedin"] },
  { name: "Zoom", slug: "zoom", brandColor: "0B5CFF", price: 1499, category: "Software", billingCycle: "monthly", aliases: ["zoom"] },
  { name: "Dropbox", slug: "dropbox", brandColor: "0061FF", price: 799, category: "Software", billingCycle: "monthly", aliases: ["dropbox"] },
  { name: "Crunchyroll", slug: "crunchyroll", brandColor: "F47521", price: 299, category: "OTT", billingCycle: "monthly", aliases: ["crunchyroll", "anime"] },
  { name: "Udemy", slug: "udemy", brandColor: "A435F0", price: 499, category: "Education", billingCycle: "monthly", aliases: ["udemy"] },
  { name: "Coursera", slug: "coursera", brandColor: "0056D2", price: 3999, category: "Education", billingCycle: "monthly", aliases: ["coursera"] },
  { name: "Gaana", slug: "gaana", brandColor: "E72C30", price: 99, category: "Music", billingCycle: "monthly", aliases: ["gaana", "ganna"] },
  { name: "Steam", slug: "steam", brandColor: "000000", price: 0, category: "Gaming", billingCycle: "monthly", aliases: ["steam"] },
];

/** Same list used for quick-add grid and name autocomplete */
export const PLATFORM_CATALOG = SUBSCRIPTION_TEMPLATES;

const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9+]/g, "");

export const searchPlatforms = (query, limit = 8) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const nq = normalize(q);

  const scored = PLATFORM_CATALOG.map((platform) => {
    const name = platform.name.toLowerCase();
    const slug = (platform.slug || "").toLowerCase();
    const aliases = platform.aliases || [];

    let score = 0;
    if (name === q || slug === nq) score = 100;
    else if (name.startsWith(q) || slug.startsWith(nq)) score = 80;
    else if (name.includes(q) || slug.includes(nq)) score = 60;
    else if (aliases.some((a) => a === q || normalize(a) === nq)) score = 75;
    else if (aliases.some((a) => a.startsWith(q) || a.includes(q))) score = 50;

    return { platform, score };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.platform);
};

export const defaultBillingDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};
