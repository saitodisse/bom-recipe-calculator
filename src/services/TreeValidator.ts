/**
 * TreeValidator class responsible for validating inputs and tree structure.
 * Provides static methods for various validations needed throughout the tree building process.
 */
export class TreeValidator {
  /**
   * Validates the required parameters for creating a materials tree.
   *
   * @param productsList Map of all available products
   * @param productCode ID of the product to calculate
   * @throws Error if required parameters are missing
   */
  public static validateRequiredParams(
    productsList: Record<string, unknown> | null | undefined,
    productCode: string | null | undefined,
  ): void {
    if (!productsList || !productCode) {
      throw new Error(
        `Required parameters not provided: productsList=${!!productsList}, productCode=${productCode}`,
      );
    }
  }

  /**
   * Validates that a product exists in the products list.
   *
   * @param productsList Map of all available products
   * @param productCode ID of the product to validate
   * @throws Error if the product is not found
   */
  public static validateProductExists(
    productsList: Record<string, unknown>,
    productCode: string,
  ): void {
    if (!productsList[productCode]) {
      throw new Error(`Product not found: ${productCode}`);
    }
  }

  /**
   * Validates a product object for required properties.
   *
   * @param product The product object to validate
   * @throws Error if the product is invalid
   */
  public static validateProduct(product: unknown): void {
    if (!product || typeof product !== "object") {
      throw new Error("Invalid product: must be an object");
    }

    const typedProduct = product as Record<string, unknown>;

    if (!typedProduct.id || typeof typedProduct.id !== "string") {
      throw new Error("Invalid product: missing or invalid id");
    }

    if (!typedProduct.name || typeof typedProduct.name !== "string") {
      throw new Error("Invalid product: missing or invalid name");
    }

    if (!typedProduct.unit || typeof typedProduct.unit !== "string") {
      throw new Error("Invalid product: missing or invalid unit");
    }

    if (!typedProduct.category || typeof typedProduct.category !== "string") {
      throw new Error("Invalid product: missing or invalid category");
    }
  }

  /**
   * Validates a recipe item for required properties.
   *
   * @param item The recipe item to validate
   * @throws Error if the item is invalid
   */
  public static validateRecipeItem(item: unknown): void {
    if (!item || typeof item !== "object") {
      throw new Error("Invalid recipe item: must be an object");
    }

    const typedItem = item as Record<string, unknown>;

    if (!typedItem.id || typeof typedItem.id !== "string") {
      throw new Error("Invalid recipe item: missing or invalid id");
    }

    if (
      typedItem.quantity !== undefined && typeof typedItem.quantity !== "number"
    ) {
      throw new Error("Invalid recipe item: quantity must be a number");
    }
  }

  /**
   * Validates a tree node for required properties.
   *
   * @param node The tree node to validate
   * @throws Error if the node is invalid
   */
  public static validateTreeNode(node: unknown): void {
    if (!node || typeof node !== "object") {
      throw new Error("Invalid tree node: must be an object");
    }

    const typedNode = node as Record<string, unknown>;

    if (!typedNode.id || typeof typedNode.id !== "string") {
      throw new Error("Invalid tree node: missing or invalid id");
    }

    if (!typedNode.name || typeof typedNode.name !== "string") {
      throw new Error("Invalid tree node: missing or invalid name");
    }

    if (!typedNode.unit || typeof typedNode.unit !== "string") {
      throw new Error("Invalid tree node: missing or invalid unit");
    }

    if (typedNode.level === undefined || typeof typedNode.level !== "number") {
      throw new Error("Invalid tree node: missing or invalid level");
    }
  }

  /**
   * Checks for circular dependencies in a product's recipe.
   *
   * @param productsList Map of all available products
   * @param productCode ID of the product to check
   * @param path Current path in the dependency tree
   * @throws Error if a circular dependency is detected
   */
  public static checkForCircularDependencies(
    productsList: Record<string, any>,
    productCode: string,
    path: string[] = [],
  ): void {
    // If we've seen this product before in the current path, we have a circular dependency
    if (path.includes(productCode)) {
      throw new Error(
        `Circular dependency detected: ${path.join(" -> ")} -> ${productCode}`,
      );
    }

    // Add the current product to the path
    const newPath = [...path, productCode];

    // Get the product
    const product = productsList[productCode];
    if (!product) {
      return; // Product not found, can't check further
    }

    // Check if the product has a recipe
    const recipe = product.recipe;
    if (!recipe || !Array.isArray(recipe) || recipe.length === 0) {
      return; // No recipe, no dependencies to check
    }

    // Check each ingredient in the recipe
    for (const item of recipe) {
      if (!item || typeof item !== "object" || !item.id) {
        continue; // Invalid item, skip
      }

      // Recursively check this ingredient
      this.checkForCircularDependencies(productsList, item.id, newPath);
    }
  }

  /**
   * Validates the maximum level to prevent infinite recursion.
   *
   * @param level Current level in the tree
   * @param maxLevel Maximum allowed level
   * @returns True if the level is valid, false if it exceeds the maximum
   */
  public static validateMaxLevel(level: number, maxLevel: number): boolean {
    // Se maxLevel for 0 ou negativo, retornar false para qualquer nível positivo
    if (maxLevel <= 0 && level > 0) {
      return false;
    }

    // Verificar se o nível atual excede o nível máximo
    return level <= maxLevel;
  }
}
