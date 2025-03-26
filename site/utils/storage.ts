/**
 * Utility functions for safely handling localStorage in both server and client environments
 */

/**
 * Safely get an item from localStorage
 * @param key The key to retrieve from localStorage
 * @param defaultValue Default value to return if key doesn't exist or localStorage is unavailable
 * @returns The stored value or defaultValue
 */
export function getStorageItem(key: string, defaultValue: string = ''): string {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (error) {
    console.error(`Error accessing localStorage for key ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 * @param key The key to set in localStorage
 * @param value The value to store
 * @returns true if successful, false otherwise
 */
export function setStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage for key ${key}:`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key The key to remove from localStorage
 * @returns true if successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage for key ${key}:`, error);
    return false;
  }
}
