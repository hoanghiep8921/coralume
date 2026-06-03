export const siteConfig = {
  name: "Coralume",
  description: "Nhận nuôi san hô — Gieo mầm cho đại dương",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://coralume.vn",
  ogImage: "/og-image.jpg",
  links: {
    facebook: "https://facebook.com/coralume_official",
    instagram: "https://instagram.com/coralume_official",
    email: "hello@coralume.vn",
  },
};

export const AMBASSADOR_THRESHOLD = 5;

export const ROLES = {
  VISITOR: "visitor",
  ADOPTER: "adopter",
  AMBASSADOR: "ambassador",
  ADMIN: "admin",
  EDITOR: "editor",
  CORAL_STAFF: "coral_staff",
} as const;

export const PRODUCT_TIERS = {
  STANDARD: "standard",
  PREMIUM: "premium",
  PREMIUM_PLUS: "premium_plus",
} as const;
