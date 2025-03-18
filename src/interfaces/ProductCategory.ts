/**
 * Product categories used to classify items in the bill of materials.
 * Each category has an ID, acronym, and description.
 */
export const ProductCategory: {
  [key: string]: ProductCategoryEntry;
} = {
  /** Final Product - Completed items ready for sale */
  FINAL_PRODUCT: {
    id: "p",
    constantName: "FINAL_PRODUCT",
    description: "Final Product",
    descriptionPtBr: "Produto Final",
  },
  /** Unit Product - Individual component that can be sold separately */
  UNIT_PRODUCT: {
    id: "u",
    constantName: "UNIT_PRODUCT",
    description: "Unit Product",
    descriptionPtBr: "Produto Unitário",
  },
  /** Semi-finished - Partially processed materials */
  SEMI_FINISHED_PRODUCT: {
    id: "s",
    constantName: "SEMI_FINISHED_PRODUCT",
    description: "Semi-finished",
    descriptionPtBr: "Semi-acabado",
  },
  /** Raw Material - Unprocessed ingredients or components */
  RAW_MATERIAL: {
    id: "m",
    constantName: "RAW_MATERIAL",
    description: "Raw Material",
    descriptionPtBr: "Materia-prima",
  },
  /** Packaging/Disposables - Materials used for wrapping or containing products */
  PACKAGING_DISPOSABLES: {
    id: "e",
    constantName: "PACKAGING_DISPOSABLES",
    description: "Packaging/Disposables",
    descriptionPtBr: "Embalagens",
  },
  /** Cleaning - Materials used for sanitation and maintenance */
  CLEANING: {
    id: "c",
    constantName: "CLEANING",
    description: "Cleaning",
    descriptionPtBr: "Limpeza",
  },
  CLEANING_BR: {
    id: "l", // alias for CLEANING
    constantName: "CLEANING",
    description: "Cleaning Products",
    descriptionPtBr: "Produtos de Limpeza",
  },
} as const;

// Type for a single category entry
export type ProductCategoryEntry = {
  id: ProductCategoryId;
  constantName: ProductCategoryConstants;
  description: string;
  descriptionPtBr: string;
};

export type ProductCategoryId = "p" | "u" | "s" | "m" | "e" | "c" | "l";

export type ProductCategoryConstants =
  | "FINAL_PRODUCT"
  | "UNIT_PRODUCT"
  | "SEMI_FINISHED_PRODUCT"
  | "RAW_MATERIAL"
  | "PACKAGING_DISPOSABLES"
  | "CLEANING";
