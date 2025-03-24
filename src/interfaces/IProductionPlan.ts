import type { IProduct } from "./IProduct.ts";

/**
 * Interface representing a production plan entry.
 * Contains information about what product to produce and in what quantity.
 */
export interface IProductionPlanEntry {
  /** Unique identifier for the entry */
  id: string;
  
  /** Optional name/description of the entry */
  name?: string;
  
  /** The product to be produced */
  product: IProduct;
  
  /** Planned quantity to produce */
  plannedQuantity: number;
  
  /** Production date */
  productionDate: Date;
  
  /** Status of the production */
  status: "planned" | "in-progress" | "completed" | "cancelled";
  
  /** Optional notes about this production */
  notes?: string;
}

/**
 * Interface representing a production plan.
 * Contains a collection of production entries and metadata.
 */
export interface IProductionPlan {
  /** Unique identifier for the plan */
  id: string;

  /** Name/description of the plan */
  name: string;

  /** When the plan was created */
  createdAt: Date;

  /** When the plan was last modified */
  updatedAt: Date;

  /** Planned production entries */
  entries: IProductionPlanEntry[];
}