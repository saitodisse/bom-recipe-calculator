import type { Maybe } from "./Maybe.ts";
import type { ProductCategoryIds } from "../enums/ProductCategory.ts";
import type { ProductUnitIds } from "../enums/ProductUnit.ts";

export interface Product {
  id: string;
  name: string;
  category: ProductCategoryIds;
  unit: ProductUnitIds;
  weight?: number | null;
  purchaseQuoteValue: number;
  notes: string;
  recipe?: RecipeArray | null;
}

export type RecipeArray = {
  id: string;
  quantity: number;
}[];

export type ProductMap = {
  [id: string]: Product;
};

export interface RecipeNode {
  [id: string]: {
    // add all properties from Product
    id: string;
    name: string;
    unit: string;
    level: number;
    motherFactor: number;
    // quantity
    quantity: Maybe<number>;
    originalQuantity: number;
    calculatedQuantity: number;
    // weight
    originalWeight: number;
    childrenWeight: number;
    // cost
    originalCost: Maybe<number>;
    calculatedCost: Maybe<number>;
    // children
    children: Maybe<RecipeNode>;
  };
}

export interface createMaterialsTreeParams {
  productsList: ProductMap;
  productCode: string;
  initialQuantity?: number;
  extraPropertiesForMother?: { [key: string]: Product };
}