// lib/constants.ts

export enum COLLECTIONS {
  REVIEWS = "reviews",
  REPLIES = "replies",
  VISITORS = "visitors",
}

export const ADMIN_UID = "HE2BB7Eo0jUtQZqs7mhKqa4FM0t1";

export const ROUTES = {
  FEEDBACK: "/reviews/feedback",
  REVIEW_EDIT: (id: string): string => `/reviews/edit/${id}`,
} as const;

export const LIMITS = {
  MAX_REPLIES: 50,
  MAX_REVIEWS_PER_USER: 1,
} as const;

export const STAR_LABELS: string[] = [
  "Terrible",
  "Bad",
  "Okay",
  "Good",
  "Excellent",
];

export const TOAST_MESSAGES = {
  REVIEW_ADDED: "Review submitted successfully!",
  REVIEW_UPDATED: "Review updated successfully!",
  REVIEW_DELETED: "Review deleted.",
  REPLY_ADDED: "Reply posted!",
  REPLY_UPDATED: "Reply updated!",
  REPLY_DELETED: "Reply deleted.",
  ERROR: "Something went wrong. Please try again.",
} as const;

export const COLORS = {
  PRIMARY: "#8b15faff",
  BACKGROUND_LIGHT: "#ffffff",
  BACKGROUND_DARK: "#111827",
} as const;

export const ICONS = {
  STAR: "★",
  STAR_EMPTY: "☆",
  EDIT: "✎",
  DELETE: "🗑️",
} as const;
