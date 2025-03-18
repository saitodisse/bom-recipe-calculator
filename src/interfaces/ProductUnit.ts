/**
 * Standard units of measurement used in the bill of materials.
 * Each unit has an ID, acronym, and description.
 */

export const ProductUnit = {
  /** Bag - Flexible container */
  BG: {
    id: "BG",
    description: "Bag",
    descriptionPtBr: "Bolsa",
  },
  /** Tray - Container organized in compartments */
  BJ: {
    id: "BJ",
    description: "Tray",
    descriptionPtBr: "Bandeja",
  },
  /** Bottle - Container for liquids */
  BT: {
    id: "BT",
    description: "Bottle",
    descriptionPtBr: "Garrafa",
  },
  /** Box - Cardboard or plastic container */
  BX: {
    id: "BX",
    description: "Box",
    descriptionPtBr: "Caixa",
  },
  /** Case - Container for multiple items */
  CS: {
    id: "CS",
    description: "Case",
    descriptionPtBr: "Caixa",
  },
  /** Box - Cardboard or plastic container */
  CX: {
    id: "CX",
    description: "Box",
    descriptionPtBr: "Caixa",
  },
  /** Each - Single item or piece */
  EA: {
    id: "EA",
    description: "Each",
    descriptionPtBr: "Unidade",
  },
  /** Bale - Bundle of items */
  FD: {
    id: "FD",
    description: "Bale",
    descriptionPtBr: "Fardo",
  },
  /** Jar - Container typically made of glass */
  GF: {
    id: "GF",
    description: "Jar",
    descriptionPtBr: "Jarro",
  },
  /** Gallon - Imperial unit of volume */
  GL: {
    id: "GL",
    description: "Gallon",
    descriptionPtBr: "Galão",
  },
  /** Jar - Container typically made of glass */
  JR: {
    id: "JR",
    description: "Jar",
    descriptionPtBr: "Jarro",
  },
  /** Kilogram - Metric unit of mass */
  KG: {
    id: "KG",
    description: "Kilogram",
    descriptionPtBr: "Quilograma",
  },
  /** Liter - Metric unit of volume for liquids */
  L: {
    id: "L",
    description: "Liter",
    descriptionPtBr: "Litro",
  },
  /** Pound - Imperial unit of mass */
  LB: {
    id: "LB",
    description: "Pound",
    descriptionPtBr: "Libra",
  },
  /** Package - Group of items packaged together */
  PC: {
    id: "PC",
    description: "Package",
    descriptionPtBr: "Pacote",
  },
  /** Pack - Group of items packaged together */
  PK: {
    id: "PK",
    description: "Pack",
    descriptionPtBr: "Pacote",
  },
  /** Pot - Container typically made of plastic or metal */
  PT: {
    id: "PT",
    description: "Pot",
    descriptionPtBr: "Pote",
  },
  /** Roll - Cylindrical package of material */
  RL: {
    id: "RL",
    description: "Roll",
    descriptionPtBr: "Rolo",
  },
  /** Bag - Flexible container */
  SC: {
    id: "SC",
    description: "Bag",
    descriptionPtBr: "Saco",
  },
  /** Tray - Container organized in compartments */
  TR: {
    id: "TR",
    description: "Tray",
    descriptionPtBr: "Prato",
  },
  /** Unit - Single item or piece */
  UN: {
    id: "UN",
    description: "Unit",
    descriptionPtBr: "Unidade",
  },
} as const;

// Extract the unit ID type from the ProductUnit object
export type ProductUnitId = typeof ProductUnit[keyof typeof ProductUnit]["id"];

// Type for a single unit entry
export type ProductUnitEntry = {
  id: ProductUnitId;
  description: string;
  descriptionPtBr: string;
};
