/**
 * Utility class providing helper methods for the materials tree calculation.
 * Contains static methods for common operations used throughout the library.
 */
export class Utils {
  /**
   * Rounds a number to 3 decimal places to avoid floating point precision issues.
   * This is particularly important when dealing with weight and cost calculations.
   *
   * @param value The number to round
   * @returns The rounded number
   */
  public static roundToThreeDecimals(value: number): number {
    if (isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return Math.sign(value) * Math.round(Math.abs(value) * 1000) / 1000;
  }

  /**
   * Generates a unique node ID by combining the item ID and parent ID.
   * This ensures that the same product used in different parts of the tree
   * has a unique identifier in each context.
   *
   * @param id The ID of the current item
   * @param motherId The ID of the parent item
   * @returns A unique node ID
   */
  public static generateNodeId(id: string, motherId: string): string {
    return `${id}_${motherId}`;
  }

  /**
   * Generates a path string representing the location of a node in the tree.
   * Useful for debugging and for detecting circular dependencies.
   *
   * @param motherPath The path of the parent node
   * @param id The ID of the current node
   * @returns The full path to the current node
   */
  public static generateNodePath(motherPath: string, id: string): string {
    return `${motherPath}.children.${id}`;
  }

  /**
   * Safely converts a value to a number, returning 0 for invalid inputs.
   *
   * @param value The value to convert to a number
   * @returns The numeric value or 0 if invalid
   */
  public static toNumber(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Safely accesses a property from an object, returning a default value if
   * the property doesn't exist or is invalid.
   *
   * @param obj The object to access
   * @param key The property key to access
   * @param defaultValue The default value to return if the property is invalid
   * @returns The property value or the default value
   */
  public static safeGet<T, K extends keyof T>(
    obj: T | null | undefined,
    key: K,
    defaultValue: T[K],
  ): T[K] {
    if (!obj) {
      return defaultValue;
    }

    const value = obj[key];
    return value === undefined || value === null ? defaultValue : value;
  }

  /**
   * Checks if a value is defined (not null or undefined).
   *
   * @param value The value to check
   * @returns True if the value is defined, false otherwise
   */
  public static isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }
}
