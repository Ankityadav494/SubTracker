import BrandLogo from "./BrandLogo";
import { SUBSCRIPTION_TEMPLATES } from "../utils/templates";

const BrandStrip = () => (
  <div className="mb-8 flex flex-wrap items-center justify-center gap-3 opacity-90">
    {SUBSCRIPTION_TEMPLATES.slice(0, 8).map((t) => (
      <BrandLogo
        key={t.name}
        name={t.name}
        slug={t.slug}
        brandColor={t.brandColor}
        size="sm"
        className="transition hover:scale-110"
      />
    ))}
  </div>
);

export default BrandStrip;
