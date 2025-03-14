import type { Product } from "../models/Product.ts";
import type { RecipeItem } from "../models/RecipeItem.ts";
import { TreeNode } from "../models/TreeNode.ts";
import { Calculator } from "../services/Calculator.ts";
import { Utils } from "../services/Utils.ts";

/**
 * Class responsible for processing nodes in the materials tree.
 * Handles the recursive creation and calculation of nodes.
 */
export class NodeProcessor {
  private _productsList: Record<string, Product>;
  private _maxLevel: number;

  /**
   * Creates a new NodeProcessor instance.
   *
   * @param productsList Map of all available products
   * @param maxLevel Maximum depth level to process
   */
  constructor(
    productsList: Record<string, Product>,
    maxLevel: number = 100,
  ) {
    this._productsList = productsList;
    this._maxLevel = maxLevel;
  }

  /**
   * Processes the root node of the materials tree.
   *
   * @param product The product to process
   * @param initialQuantity Initial quantity to calculate
   * @param extraProps Additional properties to add to the root node
   * @returns The processed root node
   */
  public processRootNode(
    product: Product,
    initialQuantity: number = 1,
    extraProps: Record<string, unknown> = {},
  ): Record<string, TreeNode> {
    const productCode = product.id;
    const motherFactor = Number(initialQuantity);

    // Process children recursively
    const children = this.processChildren(
      product,
      motherFactor,
      productCode,
      productCode,
      1,
    );

    // Calculate total cost of children
    const calculatedCost = Calculator.calculateTotalChildrenCost(children);

    // Determine weight based on product unit
    let weight = product.weight || 0;
    if (product.isKilogram()) {
      weight = Number(initialQuantity);
    }

    // Calculate total weight
    let childrenWeight = 0;
    if (children && Object.keys(children).length > 0) {
      if (!product.isKilogram()) {
        // For products not measured in KG
        if (weight > 0) {
          // If has registered weight, use it * quantity
          childrenWeight = Utils.roundToThreeDecimals(
            weight * Number(initialQuantity),
          );
        } else {
          // If no registered weight, sum children's weights
          childrenWeight = Calculator.calculateChildWeight(children);
        }
      } else {
        // For products in KG, sum children's weights directly
        childrenWeight = Object.values(children).reduce((acc, child) => {
          if (!child) return acc;
          return acc + (child.weight || 0);
        }, 0);

        // Get weight like calculatedFactor
        weight = Number(initialQuantity);
      }
    } else {
      if (product.isKilogram()) {
        weight = Number(initialQuantity);
      }
      childrenWeight = 0;
    }

    // Create root node
    const rootNode = new TreeNode({
      id: productCode,
      name: product.name,
      category: product.category,
      unit: product.unit,
      level: 0,
      motherFactor: 1,
      quantity: null,
      originalQuantity: initialQuantity,
      calculatedQuantity: Number(initialQuantity),
      weight,
      childrenWeight: Utils.roundToThreeDecimals(childrenWeight),
      originalCost: product.purchaseQuoteValue,
      calculatedCost: product.purchaseQuoteValue !== null
        ? Utils.roundToThreeDecimals(
          product.purchaseQuoteValue * initialQuantity,
        )
        : calculatedCost,
      children,
      ...extraProps,
    });

    // Return as a record with the product code as key
    return { [productCode]: rootNode };
  }

  /**
   * Processes a child node of the materials tree.
   *
   * @param item The recipe item to process
   * @param motherFactor Multiplication factor from parent recipe
   * @param motherId ID of the parent node
   * @param motherPath Path to the parent node
   * @param level Current depth level
   * @returns The processed child node
   */
  public processChildNode(
    item: RecipeItem,
    motherFactor: number,
    motherId: string,
    motherPath: string,
    level: number,
  ): TreeNode | null {
    // Get product from list
    const product = this._productsList[item.id];
    if (!product) {
      return null;
    }

    // Calculate factors
    const calculatedFactor = item.calculateWithFactor(motherFactor);
    const productId = item.id;
    const path = Utils.generateNodePath(motherPath, item.id);

    // Calculate item's own cost and weight
    const originalCost = product.purchaseQuoteValue;
    const itemCost = Calculator.calculateItemCost(
      {
        quantity: item.quantity,
        factor: motherFactor,
        unitCost: originalCost || 0,
      },
    );

    const itemWeight = Calculator.calculateItemWeight(
      {
        quantity: item.quantity,
        factor: motherFactor,
        customWeight: product.weight || 0,
        unit: product.unit,
      },
    );

    // Process children recursively if they exist
    const children = product.hasRecipe()
      ? this.processChildren(
        product,
        calculatedFactor,
        productId,
        path,
        level + 1,
      )
      : null;

    // Calculate total cost and weight including children
    const childrenCost = Calculator.calculateTotalChildrenCost(children);
    const childrenWeight = Calculator.calculateChildWeight(children);

    // Create the node with all calculated values
    return new TreeNode({
      id: productId,
      name: product.name,
      category: product.category,
      unit: product.unit,
      level,
      motherFactor,
      quantity: item.quantity,
      originalQuantity: item.quantity,
      calculatedQuantity: calculatedFactor,
      weight: Utils.roundToThreeDecimals(itemWeight),
      childrenWeight: Utils.roundToThreeDecimals(childrenWeight),
      originalCost,
      calculatedCost: Utils.roundToThreeDecimals(
        originalCost !== null ? itemCost : childrenCost,
      ),
      children,
    });
  }

  /**
   * Processes all children of a product.
   *
   * @param product The product to process children for
   * @param motherFactor Multiplication factor from parent recipe
   * @param motherId ID of the parent node
   * @param motherPath Path to the parent node
   * @param level Current depth level
   * @returns Map of processed child nodes
   */
  private processChildren(
    product: Product,
    motherFactor: number,
    motherId: string,
    motherPath: string,
    level: number,
  ): Record<string, TreeNode> | null {
    // Check if exceeded level limit
    if (level > this._maxLevel) {
      return null;
    }

    // Get composition of the product
    const composition = product.recipe;
    if (!composition || composition.length === 0) {
      return null;
    }

    // Process each item in the composition
    const result: Record<string, TreeNode> = {};

    for (const item of composition) {
      const node = this.processChildNode(
        item,
        motherFactor,
        motherId,
        motherPath,
        level,
      );

      if (node) {
        result[item.id] = node;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }
}
