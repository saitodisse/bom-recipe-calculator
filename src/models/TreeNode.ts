import type { ITreeNode } from "../interfaces/ITreeNode.ts";
import type { ProductCategoryId } from "../interfaces/ProductCategory.ts";

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
  private _path: string;
  private _motherFactor: number;
  private _quantity: number | null;
  private _calculatedQuantity: number;
  private _weight: number;
  private _childrenWeight: number;
  private _unitCost: number | null;
  private _calculatedCost: number | null;
  private _children: Record<string, TreeNode> | null;
  private _extraProperties: Record<string, unknown>;

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
    this._path = data.path ?? "";
    this._motherFactor = data.motherFactor ?? 1;
    this._quantity = data.quantity ?? null;
    this._calculatedQuantity = data.calculatedQuantity ?? 0;
    this._weight = data.weight ?? 0;
    this._childrenWeight = data.childrenWeight ?? 0;
    this._unitCost = data.unitCost ?? null;
    this._calculatedCost = data.calculatedCost ?? null;
    this._children = data.children
      ? this._convertChildren(data.children)
      : null;
    this._extraProperties = {};

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
   * Gets the node path.
   *
   * @returns The node path
   */
  public get path(): string {
    return this._path;
  }

  /**
   * Gets the node mother factor.

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
   * Gets the node unit cost.
   *
   * @returns The node unit cost
   */
  public get unitCost(): number | null {
    return this._unitCost;
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
    this._childrenWeight = weight;
  }

  /**
   * Sets the node unit cost.
   *
   * @param cost The cost to set
   */
  public setUnitCost(cost: number): void {
    this._unitCost = cost;
  }

  /**
   * Sets the node calculated cost.
   *
   * @param cost The cost to set
   */
  public setCalculatedCost(cost: number): void {
    this._calculatedCost = cost;
  }

  /**
   * Sets the node's calculated quantity.
   * Updates the calculated quantity while maintaining other properties.
   *
   * @param quantity The new calculated quantity
   */
  public setCalculatedQuantity(quantity: number): void {
    this._calculatedQuantity = quantity;
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
  public toObject(
    { expandOnlyToLevel = null }: { expandOnlyToLevel?: number | null } = {},
  ): ITreeNode {
    const result: ITreeNode = {
      id: this._id,
      name: this._name,
      category: this._category,
      unit: this._unit,
      level: this._level,
      path: this._path,
      motherFactor: this._motherFactor,
      quantity: this._quantity,
      calculatedQuantity: this._calculatedQuantity,
      weight: this._weight,
      childrenWeight: this._childrenWeight,
      unitCost: this._unitCost,
      calculatedCost: this._calculatedCost,
      children: this._children &&
        (expandOnlyToLevel === null ||
          expandOnlyToLevel === undefined ||
          expandOnlyToLevel >= 0) &&
        Object.fromEntries(
          Object.entries(this._children).map((
            [key, value],
          ) => {
            if (
              // check if is null or undefined
              (expandOnlyToLevel === null ||
                expandOnlyToLevel === undefined ||
                this._level < expandOnlyToLevel)
            ) {
              return [key, value.toObject({ expandOnlyToLevel })];
            }
            return undefined;
          }).filter((value) => value !== undefined),
        ),
      ...this._extraProperties,
    };

    return result;
  }

  public toStringJson(
    { expandOnlyToLevel = null }: { expandOnlyToLevel?: number | null } = {},
  ): string {
    // first get toObject with expandOnlyToLevel
    const toObjectResult = this.toObject({ expandOnlyToLevel });

    const result: Record<string, unknown> = {
      ...toObjectResult,
      id: toObjectResult.id,
      name: toObjectResult.name,
      category: toObjectResult.category,
      unit: toObjectResult.unit,
      level: toObjectResult.level,
      path: toObjectResult.path,
      motherFactor: toObjectResult.motherFactor,
      quantity: toObjectResult.quantity,
      calculatedQuantity: toObjectResult.calculatedQuantity,
      weight: toObjectResult.weight,
      childrenWeight: toObjectResult.childrenWeight,
      unitCost: toObjectResult.unitCost,
      calculatedCost: toObjectResult.calculatedCost,
      children: toObjectResult.children
        ? Object.fromEntries(
          Object.entries(toObjectResult.children).map((
            [key, value],
          ) => [key, value]),
        )
        : null,
    };

    return JSON.stringify(result, null, 2);
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
    expandOnlyToLevel = null,
  }: {
    showCost?: boolean;
    showWeight?: boolean;
    showQuantity?: boolean;
    expandOnlyToLevel?: number | null;
  } = {}): string {
    // First call toObject to apply expandOnlyToLevel
    const processedTree = new TreeNode(this.toObject({ expandOnlyToLevel }));

    // Calculate maxLength for the processed tree
    const maxLength = processedTree.calculateMaxLength();

    // Generate formatted output with the processed tree
    // No need to pass expandOnlyToLevel again as it's already applied
    return processedTree.generateFormattedOutput(maxLength, {
      showCost,
      showWeight,
      showQuantity,
      expandOnlyToLevel: null, // Already applied in toObject
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
    {
      showCost,
      showWeight,
      showQuantity,
      expandOnlyToLevel,
    }: {
      showCost: boolean;
      showWeight: boolean;
      showQuantity: boolean;
      expandOnlyToLevel?: number | null;
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
          expandOnlyToLevel,
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
  public toTable({ includeHeader = true, expandOnlyToLevel = null }: {
    includeHeader?: boolean;
    expandOnlyToLevel?: number | null;
  } = {}): string {
    // First call toObject to apply expandOnlyToLevel
    const processedTree = new TreeNode(this.toObject({ expandOnlyToLevel }));

    return processedTree._generateTableOutput({ includeHeader });
  }

  /**
   * Internal method to generate table output after expandOnlyToLevel has been applied
   *
   * @param includeHeader Whether to include the header row
   * @returns A table string representation of the node
   */
  private _generateTableOutput(
    { includeHeader = true }: { includeHeader?: boolean } = {},
  ): string {
    const result = [];

    // Header only included if includeHeader is true
    if (includeHeader) {
      result.push(
        `"código do produto"\t"produto"\t"nível"\t"categoria"\t"unidade"\t"quantidade"\t"peso"\t"peso dos filhos"\t"custo unitário"\t"custo total"\t"path"`,
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

    const _unitCost = Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(this.unitCost ?? 0);

    const _calculatedCost = Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(this.calculatedCost ?? 0);

    result.push(
      `"${this._id}"\t"${this._name}"\t"${this._level}"\t"${
        this.getCategoryPtBr(this._category as ProductCategoryId)
      }"\t"${this._unit}"\t"${_calculatedQuantity}"\t"${_weight}"\t"${_childrenWeight}"\t"${_unitCost}"\t"${_calculatedCost}"\t"${this._path}"`,
    );

    if (this._children) {
      for (const child of Object.values(this._children)) {
        result.push(
          child._generateTableOutput({ includeHeader: false }),
        ); // Pass false to prevent header repetition
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

  public getNodeByPath(path: string): ITreeNode | null {
    if (this._path === path) {
      return this.toObject();
    }

    if (this._children) {
      for (const child of Object.values(this._children)) {
        const result = child.getNodeByPath(path);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }
}
