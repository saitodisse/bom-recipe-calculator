export type ProductCategoryIds =
  | "p"  // Final Product
  | "u"  // Unit Product
  | "s"  // Semi-finished
  | "m"  // Raw Material
  | "e"  // Packaging/Disposables
  | "c"; // Cleaning

export type ProductCategoryProps = {
  id: ProductCategoryIds;
  code: string;
  description: string;
};

export const ProductCategory: {
  [id in ProductCategoryIds]: ProductCategoryProps;
} = {
  p: {
    id: "p",
    code: "p",
    description: "Final Product",
  },
  u: {
    id: "u",
    code: "u",
    description: "Unit Product",
  },
  s: {
    id: "s",
    code: "s",
    description: "Semi-finished",
  },
  m: {
    id: "m",
    code: "m",
    description: "Raw Material",
  },
  e: {
    id: "e",
    code: "e",
    description: "Packaging/Disposables",
  },
  c: {
    id: "c",
    code: "c",
    description: "Cleaning",
  },
};