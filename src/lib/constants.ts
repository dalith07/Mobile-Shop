export const ARTICLE_PER_PAGE = 12;

export const PRODUCTION_DOMAIN = "https://cloud-hosting-cyan.vercel.app";
export const DEVELOPMENT_DOMAIN = "http://localhost:3000";
export const DEVELOPMENT_DOMAIN_PHONE = "http://192.168.1.148:3000";

// Automatically detect if running on localhost or local network
export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : typeof window !== "undefined" && window.location.host.includes("192.168")
    ? DEVELOPMENT_DOMAIN_PHONE
    : DEVELOPMENT_DOMAIN;
