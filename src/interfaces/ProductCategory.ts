/**
 * Product categories used to classify items in the bill of materials.
 * Each category has an ID, acronym, and description.
 */
export const ProductCategory = {
  /** Final Product - Completed items ready for sale */
  p: {
    id: "p",
    description: "Final Product",
  },
  /** Unit Product - Individual component that can be sold separately */
  u: {
    id: "u",
    description: "Unit Product",
  },
  /** Semi-finished - Partially processed materials */
  s: {
    id: "s",
    description: "Semi-finished",
  },
  /** Raw Material - Unprocessed ingredients or components */
  m: {
    id: "m",
    description: "Raw Material",
  },
  /** Packaging/Disposables - Materials used for wrapping or containing products */
  e: {
    id: "e",
    description: "Packaging/Disposables",
  },
  /** Cleaning - Materials used for sanitation and maintenance */
  c: {
    id: "c",
    description: "Cleaning",
  },
} as const;

// Extract the category ID type from the ProductCategory object
export type ProductCategoryId =
  typeof ProductCategory[keyof typeof ProductCategory]["id"];

// Type for a single category entry
export type ProductCategoryEntry = {
  id: ProductCategoryId;
  description: string;
};
