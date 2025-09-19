/**
 * Utilities for managing The Blue Alliance API key in localStorage
 */

const TBA_API_KEY_STORAGE_KEY = 'tba-api-key';

/**
 * Gets the stored TBA API key from localStorage
 */
export function getTBAApiKey(): string | null {
  try {
    return localStorage.getItem(TBA_API_KEY_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to read TBA API key from localStorage:', error);
    return null;
  }
}

/**
 * Stores the TBA API key in localStorage
 */
export function setTBAApiKey(apiKey: string): void {
  try {
    localStorage.setItem(TBA_API_KEY_STORAGE_KEY, apiKey.trim());
  } catch (error) {
    console.error('Failed to store TBA API key in localStorage:', error);
    throw new Error('Failed to save API key');
  }
}

/**
 * Removes the TBA API key from localStorage
 */
export function removeTBAApiKey(): void {
  try {
    localStorage.removeItem(TBA_API_KEY_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to remove TBA API key from localStorage:', error);
  }
}

/**
 * Checks if a TBA API key is currently stored
 */
export function hasTBAApiKey(): boolean {
  const key = getTBAApiKey();
  return key !== null && key.trim().length > 0;
}

