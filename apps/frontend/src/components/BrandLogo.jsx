import { useState, useEffect } from "react";
import { getBrand, brandLogoUrl, guessDomain } from "../utils/brands";

const sizes = {
  sm: "h-9 w-9 rounded-xl text-sm",
  md: "h-12 w-12 rounded-2xl text-lg",
  lg: "h-16 w-16 rounded-2xl text-2xl",
  xl: "h-20 w-20 rounded-3xl text-3xl",
  hero: "h-[4.25rem] w-[4.25rem] rounded-2xl text-3xl sm:h-20 sm:w-20",
};

const BrandLogo = ({ name, category, slug, brandColor, size = "md", className = "" }) => {
  const brand = slug
    ? { slug, color: brandColor || "78716C", initial: name?.charAt(0) }
    : getBrand(name, category);

  // Always resolve domain to allow fallback stages if slug logo fails
  const domain = guessDomain(name);
  
  // Stages: 0 = Clearbit/SimpleIcons, 1 = Google Favicon, 2 = DuckDuckGo, 3 = Initials
  const [loadStage, setLoadStage] = useState(0);

  // Reset stage if inputs change
  useEffect(() => {
    setLoadStage(0);
  }, [name, slug]);

  let src = null;
  let isExternal = false;

  if (brand.slug) {
    if (loadStage === 0) {
      src = brandLogoUrl(brand.slug);
    } else if (loadStage === 1 && domain) {
      src = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
      isExternal = true;
    } else if (loadStage === 2 && domain) {
      src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      isExternal = true;
    }
  } else if (domain) {
    if (loadStage === 0) {
      src = `https://logo.clearbit.com/${domain}`;
      isExternal = true;
    } else if (loadStage === 1) {
      src = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
      isExternal = true;
    } else if (loadStage === 2) {
      src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      isExternal = true;
    }
  }

  const handleLoadError = () => {
    setLoadStage((prev) => prev + 1);
  };

  const bg = isExternal && src ? "#ffffff" : `#${brand.color}`;
  
  // Fallback to name's first character if brand.initial is missing
  const initialText = brand.initial || name?.trim().charAt(0).toUpperCase() || "?";

  // Calculate explicit sizes to guarantee perfect rendering inside parent flexbox
  const imgClass = size === "sm"
    ? (isExternal ? "p-0.5 h-7 w-7" : "h-6 w-6")
    : size === "md"
    ? (isExternal ? "p-1 h-9 w-9" : "h-8 w-8")
    : size === "lg"
    ? (isExternal ? "p-1.5 h-12 w-12" : "h-11 w-11")
    : size === "hero"
    ? (isExternal ? "p-1.5 h-14 w-14 sm:h-16 sm:w-16" : "h-14 w-14 sm:h-16 sm:w-16")
    : (isExternal ? "p-2 h-15 w-15" : "h-14 w-14");

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/20 ${sizes[size]} ${className}`}
      style={{
        backgroundColor: bg,
        boxShadow: src
          ? `0 8px 28px -6px ${bg}99, 0 0 0 1px rgba(255,255,255,0.08)`
          : `0 8px 24px -8px ${bg}88`,
      }}
      title={name}
    >
      {src && loadStage < 3 ? (
        <img
          src={src}
          alt=""
          className={`object-contain drop-shadow-sm ${imgClass}`}
          loading="lazy"
          onError={handleLoadError}
        />
      ) : (
        <span className="font-bold text-white drop-shadow">
          {initialText}
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
