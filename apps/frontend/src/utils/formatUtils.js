// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount}`;
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Shorten long text
export const truncate = (text, length = 15) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};