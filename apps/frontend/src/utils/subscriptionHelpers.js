export const monthlyEquivalent = (price, billingCycle = "monthly") =>
  billingCycle === "yearly" ? Number(price) / 12 : Number(price);

export const yearlyEquivalent = (price, billingCycle = "monthly") =>
  billingCycle === "yearly" ? Number(price) : Number(price) * 12;

export const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
