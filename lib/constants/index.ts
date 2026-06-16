// Application-wide constants.
// Never put secrets here — use environment variables.

export const APP_NAME = "LaunchSafe";
export const APP_DESCRIPTION =
  "The compliance intelligence platform for African businesses.";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File uploads
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_EVIDENCE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];

// Compliance score
export const COMPLIANCE_SCORE_MAX = 100;
export const COMPLIANCE_SCORE_MIN = 0;


