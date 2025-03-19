import type { ITreeNode } from "../interfaces/ITreeNode.ts";
import type { ProductCategoryId } from "../interfaces/ProductCategory.ts";
import { Utils } from "../services/Utils.ts";

/**
 * Class representing a node in the materials tree.
 * Encapsulates node data and provides methods for accessing and manipulating it.
 */
export class TreeNode implements ITreeNode {
  private _id: string;
  private _name: string;
  private _category: string;
  private _unit: string;
  private _level: number;
  private _motherFactor: number;
  private _quantity: number | null;
  private _originalQuantity: number;
  private _calculatedQuantity: number;
  private _weight: number;
  private _childrenWeight: number;
  private _originalCost: number | null;
  private _calculatedCost: number | null;
  private _children: Record<string, TreeNode> | null;
  private _extraProperties: Record<string, unknown>;

  /**
   * Index signature to satisfy ITreeNode interface
   */
  [key: string]: unknown;

  /**
   * Creates a new TreeNode instance.
   *
   * @param data Node data to initialize with
   * @throws Error if required properties are missing or invalid
   */
  constructor(data: Partial<ITreeNode>) {
    // Set default values
    this._id = data.id || "";
    this._name = data.name || "";
    this._category = data.category || "";
    this._unit = data.unit || "";
    this._level = data.level ?? 0;
    this._motherFactor = data.motherFactor ?? 1;
    this._quantity = data.quantity ?? null;
    this._originalQuantity = data.originalQuantity ?? 1;
    this._calculatedQuantity = data.calculatedQuantity ?? 0;
    this._weight = data.weight ?? 0;
    this._childrenWeight = data.childrenWeight ?? 0;
    this._originalCost = data.originalCost ?? null;
    this._calculatedCost = data.calculatedCost ?? null;
    this._children = data.children
      ? this._convertChildren(data.children)
      : null;
    this._extraProperties = {};

    // Add any extra properties
    for (const key in data) {
      if (
        ![
          "id",
          "name",
          "category",
          "unit",
          "level",
          "motherFactor",
          "quantity",
          "originalQuantity",
          "calculatedQuantity",
          "weight",
          "childrenWeight",
          "originalCost",
          "calculatedCost",
          "children",
        ].includes(key)
      ) {
        this._extraProperties[key] = data[key];
        this[key] = data[key]; // Add to index signature
      }
    }

    // Validate required properties
    this._validateRequiredProperties();
  }

  /**
   * Gets the node ID.
   *
   * @returns The node ID
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the node name.
   *
   * @returns The node name
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Gets the node category.
   *
   * @returns The node category
   */
  public get category(): string {
    return this._category;
  }

  /**
   * Gets the node unit.
   *
   * @returns The node unit
   */
  public get unit(): string {
    return this._unit;
  }

  /**
   * Gets the node level.
   *
   * @returns The node level
   */
  public get level(): number {
    return this._level;
  }

  /**
   * Gets the node mother factor.
   *
   * @returns The node mother factor
   */
  public get motherFactor(): number {
    return this._motherFactor;
  }

  /**
   * Gets the node quantity.
   *
   * @returns The node quantity
   */
  public get quantity(): number | null {
    return this._quantity;
  }

  /**
   * Gets the node original quantity.
   *
   * @returns The node original quantity
   */
  public get originalQuantity(): number {
    return this._originalQuantity;
  }

  /**
   * Gets the node calculated quantity.
   *
   * @returns The node calculated quantity
   */
  public get calculatedQuantity(): number {
    return this._calculatedQuantity;
  }

  /**
   * Gets the node weight.
   *
   * @returns The node weight
   */
  public get weight(): number {
    return this._weight;
  }

  /**
   * Gets the node children weight.
   *
   * @returns The node children weight
   */
  public get childrenWeight(): number {
    return this._childrenWeight;
  }

  /**
   * Gets the node original cost.
   *
   * @returns The node original cost
   */
  public get originalCost(): number | null {
    return this._originalCost;
  }

  /**
   * Gets the node calculated cost.
   *
   * @returns The node calculated cost
   */
  public get calculatedCost(): number | null {
    return this._calculatedCost;
  }

  /**
   * Gets the node children.
   *
   * @returns The node children
   */
  public get children(): Record<string, TreeNode> | null {
    return this._children;
  }

  /**
   * Sets the node children weight.
   *
   * @param weight The weight to set
   */
  public setChildrenWeight(weight: number): void {
    this._childrenWeight = Utils.roundToThreeDecimals(weight);
  }

  /**
   * Sets the node calculated cost.
   *
   * @param cost The cost to set
   */
  public setCalculatedCost(cost: number): void {
    this._calculatedCost = Utils.roundToThreeDecimals(cost);
  }

  /**
   * Adds a child node.
   *
   * @param node The child node to add
   */
  public addChild(node: TreeNode): void {
    if (!this._children) {
      this._children = {};
    }

    this._children[node.id] = node;
  }

  /**
   * Gets an extra property value.
   *
   * @param key The property key
   * @returns The property value or undefined if not found
   */
  public getExtraProperty<T>(key: string): T | undefined {
    return this._extraProperties[key] as T;
  }

  /**
   * Sets an extra property value.
   *
   * @param key The property key
   * @param value The property value
   */
  public setExtraProperty<T>(key: string, value: T): void {
    this._extraProperties[key] = value;
  }

  /**
   * Converts the node to a plain object.
   *
   * @returns A plain object representation of the node
   */
  public toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      id: this._id,
      name: this._name,
      category: this._category,
      unit: this._unit,
      level: this._level,
      motherFactor: this._motherFactor,
      quantity: this._quantity,
      originalQuantity: this._originalQuantity,
      calculatedQuantity: this._calculatedQuantity,
      weight: this._weight,
      childrenWeight: this._childrenWeight,
      originalCost: this._originalCost,
      calculatedCost: this._calculatedCost,
      children: this._children
        ? Object.fromEntries(
          Object.entries(this._children).map((
            [key, value],
          ) => [key, value.toJSON()]),
        )
        : null,
      ...this._extraProperties,
    };

    return result;
  }

  /**
    - bread [p]  1 UN
      - dough [s] 0.5 UN
        - flour [m] 0.5 kg
        - water [m] 0.25 L
        - salt [m] 0.01 kg
        - yeast [m] 0.015 kg
   */
  public toHumanReadable({
    showCost = false,
    showWeight = false,
    showQuantity = true,
  }: {
    showCost?: boolean;
    showWeight?: boolean;
    showQuantity?: boolean;
  } = {}): string {
    // First pass: calculate maxLength
    const maxLength = this.calculateMaxLength();

    // Second pass: generate formatted output
    return this.generateFormattedOutput(maxLength, {
      showCost,
      showWeight,
      showQuantity,
    });
  }

  private calculateMaxLength(): number {
    let maxLength = this.getBaseLineLength();

    if (this._children) {
      for (const child of Object.values(this._children)) {
        maxLength = Math.max(maxLength, child.calculateMaxLength());
      }
    }

    return maxLength;
  }

  private getBaseLineLength(): number {
    const indent = this._level > 0 ? ".   ".repeat(this._level) : "";
    return `${indent}${this._id}`.length;
  }

  private generateFormattedOutput(
    maxLength: number,
    { showCost, showWeight, showQuantity }: {
      showCost: boolean;
      showWeight: boolean;
      showQuantity: boolean;
    },
  ): string {
    let result = this.formatLine(maxLength, {
      showCost,
      showWeight,
      showQuantity,
    });

    if (this._children) {
      for (const child of Object.values(this._children)) {
        result += child.generateFormattedOutput(maxLength, {
          showCost,
          showWeight,
          showQuantity,
        });
      }
    }

    return result;
  }

  private formatLine(
    maxLength: number,
    { showCost, showWeight, showQuantity }: {
      showCost: boolean;
      showWeight: boolean;
      showQuantity: boolean;
    },
  ): string {
    const indent = this._level > 0 ? ".   ".repeat(this._level) : "";
    const baseLine = `${indent}${this._id}`;
    let line = baseLine;

    // Fixed column widths
    const QUANTITY_COL_WIDTH = 8;
    const UNIT_COL_WIDTH = 4;
    const WEIGHT_COL_WIDTH = 8;
    const CHILDREN_WEIGHT_COL_WIDTH = 8;
    const COST_COL_WIDTH = 6;

    const quantity = this._calculatedQuantity || this._quantity;
    const baseLinePadding = " ".repeat(maxLength - baseLine.length);
    line += baseLinePadding;

    // Add quantity with fixed width column
    if (showQuantity) {
      const quantityStr = Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(quantity ?? 0);
      const unitStr = this._unit.padEnd(UNIT_COL_WIDTH);
      line += ` ${quantityStr.padStart(QUANTITY_COL_WIDTH)} ${unitStr}`;
    }

    // Add weight with fixed width columns
    if (showWeight) {
      const weightStr = Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(this.weight);

      const childrenWeightStr = Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(this.childrenWeight);

      if (this.weight === 0) {
        line += ` ${"".padStart(WEIGHT_COL_WIDTH)}   `;
      } else {
        line += ` ${weightStr.padStart(WEIGHT_COL_WIDTH)} kg`;
      }

      if (this.childrenWeight === 0) {
        line += ` ${"".padStart(CHILDREN_WEIGHT_COL_WIDTH)}   `;
      } else {
        line += ` ${childrenWeightStr.padStart(CHILDREN_WEIGHT_COL_WIDTH)} kg`;
      }
    }

    // Add cost with fixed width column
    if (showCost) {
      const calculatedCost = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(this.calculatedCost ?? 0);
      const costStr = calculatedCost || "0";
      line += `  ${costStr.padStart(COST_COL_WIDTH)}`;
    }

    return line + "\n";
  }

  /**
   * Converts the node to a table string.
   *
   * @returns A table string representation of the node
   */
  public toTable(includeHeader: boolean = true): string {
    const result = [];

    // Header only included if includeHeader is true
    if (includeHeader) {
      result.push(
        `"código do produto"\t"produto"\t"nível"\t"categoria"\t"unidade"\t"quantidade"\t"peso"\t"peso dos filhos"\t"custo total"`,
      );
    }

    const _calculatedQuantity = Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(this._calculatedQuantity ?? 0);

    const _weight = Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(this.weight);

    const _childrenWeight = Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(this.childrenWeight);

    const _calculatedCost = Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(this.calculatedCost ?? 0);

    result.push(
      `"${this._id}"\t"${this._name}"\t"${this._level}"\t"${
        this.getCategoryPtBr(this._category as ProductCategoryId)
      }"\t"${this._unit}"\t"${_calculatedQuantity}"\t"${_weight}"\t"${_childrenWeight}"\t"${_calculatedCost}"`,
    );

    if (this._children) {
      for (const child of Object.values(this._children)) {
        result.push(child.toTable(false)); // Pass false to prevent header repetition
      }
    }

    return result.join("\n");
  }

  private getCategoryPtBr(category: ProductCategoryId) {
    switch (category) {
      case "p":
        return "[p] produto";
      case "u":
        return "[u] produto unitário";
      case "s":
        return "[s] semi-acabado";
      case "m":
        return "[m] matéria-prima";
      case "e":
        return "[e] embalagem";
      case "c":
        return "[c] limpeza";
      case "l":
        return "[l] limpeza";
      default:
        return category;
    }
  }

  /**
   * Validates that required properties are present and valid.
   *
   * @throws Error if required properties are missing or invalid
   */
  private _validateRequiredProperties(): void {
    if (!this._id) {
      throw new Error("Node ID is required");
    }

    if (!this._name) {
      throw new Error("Node name is required");
    }

    if (!this._unit) {
      throw new Error("Node unit is required");
    }

    if (this._level < 0) {
      throw new Error("Node level must be a non-negative number");
    }

    if (this._motherFactor <= 0) {
      throw new Error("Node mother factor must be a positive number");
    }
  }

  /**
   * Converts children from plain objects to TreeNode instances.
   *
   * @param children The children to convert
   * @returns The converted children
   */
  private _convertChildren(
    children: Record<string, ITreeNode>,
  ): Record<string, TreeNode> {
    const result: Record<string, TreeNode> = {};

    for (const [key, value] of Object.entries(children)) {
      if (value) {
        result[key] = value instanceof TreeNode ? value : new TreeNode(value);
      }
    }

    return result;
  }

  /**
   * Gets a property value by key.
   * This method is used to satisfy the index signature requirement of ITreeNode.
   *
   * @param key The property key
   * @returns The property value
   */
  public get(key: string): unknown {
    // Handle standard properties
    switch (key) {
      case "id":
        return this._id;
      case "name":
        return this._name;
      case "category":
        return this._category;
      case "unit":
        return this._unit;
      case "level":
        return this._level;
      case "motherFactor":
        return this._motherFactor;
      case "quantity":
        return this._quantity;
      case "originalQuantity":
        return this._originalQuantity;
      case "calculatedQuantity":
        return this._calculatedQuantity;
      case "weight":
        return this._weight;
      case "childrenWeight":
        return this._childrenWeight;
      case "originalCost":
        return this._originalCost;
      case "calculatedCost":
        return this._calculatedCost;
      case "children":
        return this._children;
      default:
        return this._extraProperties[key];
    }
  }
}
