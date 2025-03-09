/**
 * Valid product category identifiers used in the system
 */
export type ProductCategoryIds =
  | "p"  // Final Product
  | "u"  // Unit Product
  | "s"  // Semi-finished
  | "m"  // Raw Material
  | "e"  // Packaging/Disposables
  | "c"; // Cleaning

/**
 * Properties that describe a product category
 */
export type ProductCategoryProps = {
  /** Category identifier */
  id: ProductCategoryIds;
  /** Short code for the category */
  acronym: string;
  /** Human readable description */
  description: string;
};

/**
 * Product categories used to classify items in the bill of materials.
 * Each category has an ID, acronym, and description.
 */
export const ProductCategory: {
  [id in ProductCategoryIds]: ProductCategoryProps;
} = {
  p: {
    id: "p",
    acronym: "p",
    description: "Final Product",
  },
  u: {
    id: "u",
    acronym: "u",
    description: "Unit Product",
  },
  s: {
    id: "s",
    acronym: "s",
    description: "Semi-finished",
  },
  m: {
    id: "m",
    acronym: "m",
    description: "Raw Material",
  },
  e: {
    id: "e",
    acronym: "e",
    description: "Packaging/Disposables",
  },
  c: {
    id: "c",
    acronym: "c",
    description: "Cleaning",
  },
};