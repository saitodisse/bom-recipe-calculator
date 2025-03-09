/**
 * Standard units of measurement used in the bill of materials.
 * Each unit has an ID, acronym, and description.
 */
export const ProductUnit = {
  /** Tray - Container organized in compartments */
  TR: {
    id: "TR",
    description: "Tray",
  },
  /** Box - Cardboard or plastic container */
  BX: {
    id: "BX",
    description: "Box",
  },
  /** Pack - Group of items packaged together */
  PK: {
    id: "PK",
    description: "Pack",
  },
  /** Bottle - Container for liquids */
  BT: {
    id: "BT",
    description: "Bottle",
  },
  /** Kilogram - Metric unit of mass */
  KG: {
    id: "KG",
    description: "Kilogram",
  },
  /** Liter - Metric unit of volume for liquids */
  L: {
    id: "L",
    description: "Liter",
  },
  /** Jar - Container typically made of glass */
  JR: {
    id: "JR",
    description: "Jar",
  },
  /** Roll - Cylindrical package of material */
  RL: {
    id: "RL",
    description: "Roll",
  },
  /** Bag - Flexible container */
  BG: {
    id: "BG",
    description: "Bag",
  },
  /** Unit - Single item or piece */
  UN: {
    id: "UN",
    description: "Unit",
  },
} as const;

// Extract the unit ID type from the ProductUnit object
export type ProductUnitId = typeof ProductUnit[keyof typeof ProductUnit]["id"];

// Type for a single unit entry
export type ProductUnitEntry = {
  id: ProductUnitId;
  description: string;
};
