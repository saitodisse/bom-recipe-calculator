import type { ICreateMaterialsTreeParams } from "../interfaces/ICreateMaterialsTreeParams";
import { Product } from "../models/Product";
import { TreeNode } from "../models/TreeNode";
import { NodeProcessor } from "./NodeProcessor";
import { TreeValidator } from "../services/TreeValidator";

/**
 * Builder class for creating a materials tree.
 * Implements the Builder pattern for fluent configuration.
 */
export class MaterialsTreeBuilder {
  private _productsList: Record<string, Product>;
  private _productCode: string;
  private _initialQuantity: number;
  private _extraPropertiesForMother: Record<string, unknown>;
  private _maxLevel: number;

  /**
   * Creates a new MaterialsTreeBuilder instance.
   *
   * @param params Configuration parameters for the tree
   */
  constructor(params: ICreateMaterialsTreeParams) {
    // Validate required parameters
    if (!params.productsList || !params.productCode) {
      throw new Error("Required parameters not provided");
    }

    // Convert plain products to Product instances
    this._productsList = this._convertProducts(params.productsList);

    // Validate that the product exists
    if (!this._productsList[params.productCode]) {
      throw new Error(`Product not found: ${params.productCode}`);
    }

    // Initialize properties
    this._productCode = params.productCode;
    this._initialQuantity = params.initialQuantity ?? 1;

    // Validate initial quantity
    if (this._initialQuantity <= 0) {
      throw new Error("Initial quantity must be greater than zero");
    }

    this._extraPropertiesForMother = params.extraPropertiesForMother ?? {};
    this._maxLevel = params.maxLevel ?? 100;

    // Check for circular dependencies
    TreeValidator.checkForCircularDependencies(
      params.productsList,
      params.productCode,
    );
  }

  /**
   * Sets the products list.
   *
   * @param productsList Map of all available products
   * @returns This builder instance for method chaining
   */
  public setProductsList(
    productsList: Record<string, Product>,
  ): MaterialsTreeBuilder {
    TreeValidator.validateRequiredParams(productsList, this._productCode);
    this._productsList = productsList;
    return this;
  }

  /**
   * Sets the product code.
   *
   * @param productCode ID of the product to calculate
   * @returns This builder instance for method chaining
   */
  public setProductCode(productCode: string): MaterialsTreeBuilder {
    TreeValidator.validateRequiredParams(this._productsList, productCode);
    TreeValidator.validateProductExists(this._productsList, productCode);
    this._productCode = productCode;
    return this;
  }

  /**
   * Sets the initial quantity.
   *
   * @param quantity Initial quantity to calculate
   * @returns This builder instance for method chaining
   */
  public setInitialQuantity(quantity: number): MaterialsTreeBuilder {
    if (quantity <= 0) {
      throw new Error("Initial quantity must be greater than zero");
    }

    this._initialQuantity = quantity;
    return this;
  }

  /**
   * Sets additional properties for the root node.
   *
   * @param props Additional properties to add to the root node
   * @returns This builder instance for method chaining
   */
  public setExtraProperties(
    props: Record<string, unknown>,
  ): MaterialsTreeBuilder {
    this._extraPropertiesForMother = props;
    return this;
  }

  /**
   * Sets the maximum depth level to process.
   *
   * @param maxLevel Maximum depth level
   * @returns This builder instance for method chaining
   */
  public setMaxLevel(maxLevel: number): MaterialsTreeBuilder {
    if (maxLevel < 0) {
      throw new Error("Max level must be a non-negative number");
    }

    this._maxLevel = maxLevel;
    return this;
  }

  /**
   * Builds the materials tree.
   *
   * @returns The complete materials tree
   */
  public build(): Record<string, TreeNode> {
    // Get the product
    const product = this._productsList[this._productCode];
    if (!product) {
      throw new Error(`Product not found: ${this._productCode}`);
    }

    // Create a node processor
    const processor = new NodeProcessor(this._productsList, this._maxLevel);

    // Process the root node
    return processor.processRootNode(
      product,
      this._initialQuantity,
      this._extraPropertiesForMother,
    );
  }

  /**
   * Converts plain product objects to Product instances.
   *
   * @param productsList Map of plain product objects
   * @returns Map of Product instances
   */
  private _convertProducts(
    productsList: Record<string, any>,
  ): Record<string, Product> {
    const result: Record<string, Product> = {};

    for (const [key, value] of Object.entries(productsList)) {
      if (value) {
        result[key] = value instanceof Product ? value : new Product(value);
      }
    }

    return result;
  }
}
