import type { ProductCategoryId } from "../interfaces/ProductCategory.ts";
import { ProductUnit, type ProductUnitId } from "../interfaces/ProductUnit.ts";
import type { IProduct } from "../interfaces/IProduct.ts";
import { RecipeItem } from "./RecipeItem.ts";

/**
 * Class representing a product in the bill of materials system.
 * Encapsulates product data and provides methods for accessing and validating it.
 */
export class Product implements IProduct {
  private _id: string;
  private _name: string;
  private _category: ProductCategoryId;
  private _unit: ProductUnitId;
  private _weight: number | null;
  private _purchaseQuoteValue: number | null;
  private _notes: string | null;
  private _recipe: RecipeItem[] | null;

  /**
   * Creates a new Product instance.
   *
   * @param data Product data to initialize with
   * @throws Error if required properties are missing or invalid
   */
  constructor(data: IProduct) {
    // Validate required properties
    if (!data.id) {
      throw new Error("Product ID is required");
    }

    if (!data.name) {
      throw new Error("Product name is required");
    }

    if (!data.category) {
      throw new Error("Product category is required");
    }

    if (!data.unit) {
      throw new Error("Product unit is required");
    }

    // Initialize properties
    this._id = data.id;
    this._name = data.name;
    this._category = data.category;
    this._unit = data.unit;
    this._weight = data.weight ?? null;
    this._purchaseQuoteValue = data.purchaseQuoteValue ?? null;
    this._notes = data.notes ?? null;

    // Convert recipe items to RecipeItem instances if present
    this._recipe = data.recipe
      ? data.recipe.map((item) => new RecipeItem(item.id, item.quantity))
      : null;
  }

  /**
   * Gets the product ID.
   *
   * @returns The product ID
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the product name.
   *
   * @returns The product name
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Gets the product category.
   *
   * @returns The product category
   */
  public get category(): ProductCategoryId {
    return this._category;
  }

  /**
   * Gets the product unit.
   *
   * @returns The product unit
   */
  public get unit(): ProductUnitId {
    return this._unit;
  }

  /**
   * Gets the product weight.
   *
   * @returns The product weight or null if not set
   */
  public get weight(): number | null {
    return this._weight;
  }

  /**
   * Gets the product purchase quote value (cost).
   *
   * @returns The product purchase quote value or null if not set
   */
  public get purchaseQuoteValue(): number | null {
    return this._purchaseQuoteValue;
  }

  /**
   * Gets the product notes.
   *
   * @returns The product notes or null if not set
   */
  public get notes(): string | null {
    return this._notes;
  }

  /**
   * Gets the product recipe.
   *
   * @returns The product recipe or null if not set
   */
  public get recipe(): RecipeItem[] | null {
    return this._recipe;
  }

  /**
   * Checks if the product has a recipe.
   *
   * @returns True if the product has a recipe, false otherwise
   */
  public hasRecipe(): boolean {
    return !!this._recipe && this._recipe.length > 0;
  }

  /**
   * Checks if the product is measured in kilograms.
   *
   * @returns True if the product is measured in kilograms, false otherwise
   */
  public isKilogram(): boolean {
    return this._unit === ProductUnit.KG.id;
  }

  /**
   * Converts the product to a plain object.
   *
   * @returns A plain object representation of the product
   */
  public toJSON(): IProduct {
    return {
      id: this._id,
      name: this._name,
      category: this._category,
      unit: this._unit,
      weight: this._weight,
      purchaseQuoteValue: this._purchaseQuoteValue,
      notes: this._notes,
      recipe: this._recipe ? this._recipe.map((item) => item.toJSON()) : null,
    };
  }
}
