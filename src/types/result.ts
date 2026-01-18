/**
 * A discriminated union type for handling success/failure results.
 * Use this instead of throwing exceptions for expected error cases.
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
