import { useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import { searchPlatforms } from "../utils/templates";
import { formatCurrency, monthlyEquivalent } from "../utils/subscriptionHelpers";
import { inputClass, labelClass } from "../utils/styles";

const PlatformNameAutocomplete = ({ value, onChange, onSelectPlatform }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef(null);
  const listId = "platform-suggestions";

  const suggestions = open && value.trim().length >= 1 ? searchPlatforms(value) : [];

  useEffect(() => {
    setHighlight(0);
  }, [value, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pick = (platform) => {
    onSelectPlatform(platform);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "ArrowDown" && value.trim()) setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && suggestions[highlight]) {
      e.preventDefault();
      pick(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor="name" className={labelClass}>
        Platform name
      </label>
      <input
        id="name"
        type="text"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClass}
        placeholder="Type Netflix, Spotify, Prime..."
      />
      <p className="mt-1 text-xs text-stone-500">
        Start typing — matching platforms will appear
      </p>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-stone-700 bg-stone-900 py-1 shadow-2xl"
        >
          {suggestions.map((platform, i) => (
            <li key={platform.name} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pick(platform)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  i === highlight
                    ? "bg-orange-500/15 text-stone-100"
                    : "text-stone-300 hover:bg-stone-800"
                }`}
              >
                <BrandLogo
                  name={platform.name}
                  slug={platform.slug}
                  brandColor={platform.brandColor}
                  size="sm"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{platform.name}</span>
                  <span className="text-xs text-stone-500">
                    {platform.category}
                    {platform.price > 0 &&
                      ` · ${formatCurrency(monthlyEquivalent(platform.price, platform.billingCycle))}/mo`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && value.trim().length >= 2 && suggestions.length === 0 && (
        <p className="absolute z-50 mt-1 w-full rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-500 shadow-lg">
          No match — you can still add a custom name
        </p>
      )}
    </div>
  );
};

export default PlatformNameAutocomplete;
