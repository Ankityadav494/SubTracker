import { useState } from "react";
import { getBrand, brandLogoUrl } from "../utils/brands";

const sizes = {
  sm: "h-9 w-9 rounded-xl [&_img]:h-5 [&_img]:w-5 [&_span]:text-sm",
  md: "h-12 w-12 rounded-2xl [&_img]:h-7 [&_img]:w-7 [&_span]:text-lg",
  lg: "h-16 w-16 rounded-2xl [&_img]:h-9 [&_img]:w-9 [&_span]:text-2xl",
  xl: "h-20 w-20 rounded-3xl [&_img]:h-11 [&_img]:w-11 [&_span]:text-3xl",
};

const BrandLogo = ({ name, category, slug, brandColor, size = "md", className = "" }) => {
  const brand = slug
    ? { slug, color: brandColor || "78716C", initial: name?.charAt(0) }
    : getBrand(name, category);

  const [imgFailed, setImgFailed] = useState(false);
  const src = brand.slug && !imgFailed ? brandLogoUrl(brand.slug) : null;
  const bg = `#${brand.color}`;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/10 ${sizes[size]} ${className}`}
      style={{
        backgroundColor: bg,
        boxShadow: `0 8px 24px -6px ${bg}88`,
      }}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="object-contain drop-shadow-sm"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="font-bold text-white drop-shadow">
          {brand.initial || "?"}
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
