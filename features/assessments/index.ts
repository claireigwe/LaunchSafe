/**
 * Assessment Feature Module
 *
 * This module owns:
 * - Assessment creation and management
 * - Summary generation (pre-payment)
 * - Full report access (post-payment verification)
 * - Assessment purchase flow
 *
 * Structure:
 *   components/   — Assessment UI components
 *   hooks/        — React Query hooks
 *   services/     — AssessmentService (business logic)
 *   repositories/ — AssessmentRepository (DB access)
 *   api/          — Client-side fetch helpers
 *   types/        — Re-exports from @/types/domain/assessment
 */

export * from "@/types/domain/assessment";
