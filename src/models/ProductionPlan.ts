import { MaterialsTreeBuilder } from "../builders/MaterialsTreeBuilder.ts";
import type { IProduct } from "../interfaces/IProduct.ts";
import type {
  IProductionPlan,
  IProductionPlanEntry,
} from "../interfaces/IProductionPlan.ts";
import type { ProductTreeMap } from "../types/ProductTreeMap.ts";
import type { TreeNode } from "./TreeNode.ts";

/**
 * Class representing a production plan.
 * Manages a collection of production entries and calculates material requirements.
 */
export class ProductionPlan implements IProductionPlan {
  private _id: string;
  private _name: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _entries: IProductionPlanEntry[];

  /**
   * Creates a new ProductionPlan instance
   */
  constructor(data: Partial<IProductionPlan>) {
    this._id = data.id || crypto.randomUUID();
    this._name = data.name || "";
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
    this._entries = data.entries || [];
  }

  /** Gets the plan ID */
  public get id(): string {
    return this._id;
  }

  /** Gets the plan name */
  public get name(): string {
    return this._name;
  }

  /** Gets when the plan was created */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /** Gets when the plan was last updated */
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  /** Gets the production entries */
  public get entries(): IProductionPlanEntry[] {
    return this._entries;
  }

  /**
   * Adds a new production entry to the plan
   */
  public addEntry(
    product: IProduct,
    plannedQuantity: number,
    productionDate: Date,
    notes?: string,
    name?: string,
  ): void {
    this._entries.push({
      id: crypto.randomUUID(),
      name,
      product,
      plannedQuantity,
      productionDate,
      status: "planned",
      notes,
    });
    this._updatedAt = new Date();
  }

  /**
   * Updates the status of a production entry
   */
  public updateEntryStatus(
    entryId: string,
    newStatus: IProductionPlanEntry["status"],
  ): void {
    const entry = this._entries.find((e) => e.id === entryId);

    if (entry) {
      entry.status = newStatus;
      this._updatedAt = new Date();
    }
  }

  /**
   * Removes a production entry from the plan
   */
  public removeEntry(entryId: string): void {
    this._entries = this._entries.filter((e) => e.id !== entryId);
    this._updatedAt = new Date();
  }

  /**
   * Calculates the total materials needed for all planned productions
   */
  public calculateMaterialsNeeded(
    productsList: Record<string, IProduct>,
  ): ProductTreeMap {
    const materialTrees: ProductTreeMap = {};

    for (const entry of this._entries) {
      const builder = new MaterialsTreeBuilder({
        productsList,
        productCode: entry.product.productCode ?? entry.product.id,
        initialQuantity: entry.plannedQuantity,
      });

      const productTree = builder.build();

      // Helper function to recursively add nodes to the material trees
      const addNodeToMaterialTrees = (node: TreeNode) => {
        const id = node.id;
        if (!materialTrees[id]) {
          materialTrees[id] = node;
        } else {
          // Add quantities
          materialTrees[id].setCalculatedQuantity(
            materialTrees[id].calculatedQuantity + node.calculatedQuantity,
          );
          materialTrees[id].setCalculatedCost(
            materialTrees[id].calculatedCost! + node.calculatedCost!,
          );
        }

        // Recursively process children
        if (node.children) {
          for (const child of Object.values(node.children)) {
            addNodeToMaterialTrees(child);
          }
        }
      };

      // Process each root node and its children
      Object.values(productTree).forEach((node) => {
        addNodeToMaterialTrees(node);
      });
    }

    return materialTrees;
  }

  /**
   * Converts the production plan to a plain object
   */
  public toJSON(): IProductionPlan {
    return {
      id: this._id,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      entries: this._entries,
    };
  }
}
