/**
 * Product categories used to classify items in the bill of materials.
 * Each category has an ID, acronym, and description.
 */
export const ProductCategory = {
  /** Final Product - Completed items ready for sale */
  FINAL_PRODUCT: {
    id: "p",
    constantName: "FINAL_PRODUCT",
    description: "Final Product",
  },
  /** Unit Product - Individual component that can be sold separately */
  UNIT_PRODUCT: {
    id: "u",
    constantName: "UNIT_PRODUCT",
    description: "Unit Product",
  },
  /** Semi-finished - Partially processed materials */
  SEMI_FINISHED_PRODUCT: {
    id: "s",
    constantName: "SEMI_FINISHED_PRODUCT",
    description: "Semi-finished",
  },
  /** Raw Material - Unprocessed ingredients or components */
  RAW_MATERIAL: {
    id: "m",
    constantName: "RAW_MATERIAL",
    description: "Raw Material",
  },
  /** Packaging/Disposables - Materials used for wrapping or containing products */
  PACKAGING_DISPOSABLES: {
    id: "e",
    constantName: "PACKAGING_DISPOSABLES",
    description: "Packaging/Disposables",
  },
  /** Cleaning - Materials used for sanitation and maintenance */
  CLEANING: {
    id: "c",
    constantName: "CLEANING",
    description: "Cleaning",
  },
} as const;

// Extract the category ID type from the ProductCategory object
export type ProductCategoryId =
  typeof ProductCategory[keyof typeof ProductCategory]["id"];

// Type for a single category entry
export type ProductCategoryEntry = {
  id: ProductCategoryId;
  constantName: string;
  description: string;
};
