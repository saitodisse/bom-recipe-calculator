import { Maybe } from "./Maybe.ts";
import { ProductCategoryIds } from "../enums/ProductCategory.ts";
import { ProductUnitIds } from "../enums/ProductUnit.ts";

export interface Product {
  code: string;
  active: boolean;
  name: string;
  category: ProductCategoryIds;
  unit: ProductUnitIds;
  weight?: number | null;
  purchaseQuoteValue: number;
  notes: string;
  recipe?: RecipeArray | null;
}

export type RecipeArray = {
  code: string;
  quantity: number;
}[];

export type ProductMap = {
  [code: string]: Product;
};

export interface RecipeNode {
  [code: string]: {
    code: string;
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

export interface CreatePureTreeCompositionParams {
  productsList: ProductMap;
  productCode: string;
  initialQuantity?: number;
  extraPropertiesForMother?: { [key: string]: Product };
}