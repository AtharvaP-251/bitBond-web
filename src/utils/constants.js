export const BASE_URL = import.meta.env.VITE_API_BASE_URL; // "http://localhost:3000" or similar removed for production readiness

export const IMG_URL = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  MESSAGES: 3000,
  NOTIFICATIONS: 30000,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Drag thresholds for swipe actions
export const SWIPE_THRESHOLD = 100;
