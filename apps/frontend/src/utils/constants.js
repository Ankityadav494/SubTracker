export const CATEGORIES = [
  "OTT",
  "Music",
  "Gaming",
  "Software",
  "Education",
  "Others",
];

export const BILLING_CYCLES = ["monthly", "yearly"];

export const STATUSES = ["active", "paused", "cancelled"];

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
