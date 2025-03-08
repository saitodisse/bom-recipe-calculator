export type ProductCategoryIds =
  | "p"  // Final Product
  | "u"  // Unit Product
  | "s"  // Semi-finished
  | "m"  // Raw Material
  | "e"  // Packaging/Disposables
  | "c"; // Cleaning

export type ProductCategoryProps = {
  id: ProductCategoryIds;
  acronym: string;
  description: string;
};

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