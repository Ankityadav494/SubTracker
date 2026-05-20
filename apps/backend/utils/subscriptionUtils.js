const monthlyEquivalent = (price, billingCycle = "monthly") =>
  billingCycle === "yearly" ? Number(price) / 12 : Number(price);

const yearlyEquivalent = (price, billingCycle = "monthly") =>
  billingCycle === "yearly" ? Number(price) : Number(price) * 12;

const appendPriceHistory = (subscription, newPrice) => {
  const price = Number(newPrice);
  const last = subscription.priceHistory?.[subscription.priceHistory.length - 1];
  if (!last || last.price !== price) {
    subscription.priceHistory.push({ price, recordedAt: new Date() });
  }
};

const buildSubscriptionQuery = (user, filters = {}) => {
  const query = {
    $or: [{ user: user._id }],
  };

  if (user.household) {
    query.$or.push({ household: user.household });
  }

  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  return query;
};

const getSortOption = (sort) => {
  switch (sort) {
    case "price":
      return { price: 1 };
    case "-price":
      return { price: -1 };
    case "-date":
      return { nextBillingDate: -1 };
    case "date":
    default:
      return { nextBillingDate: 1 };
  }
};

module.exports = {
  monthlyEquivalent,
  yearlyEquivalent,
  appendPriceHistory,
  buildSubscriptionQuery,
  getSortOption,
};
