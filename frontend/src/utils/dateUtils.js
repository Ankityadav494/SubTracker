// Format date → 12/05/2026
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

// Days left until next billing
export const getDaysLeft = (date) => {
  const today = new Date();
  const target = new Date(date);

  const diff = target - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Check if subscription is upcoming (within 3 days)
export const isUpcoming = (date) => {
  const days = getDaysLeft(date);
  return days >= 0 && days <= 3;
};

// Convert billing cycle → next billing date
export const getNextBillingDate = (currentDate, cycle) => {
  const date = new Date(currentDate);

  if (cycle === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (cycle === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date;
};
