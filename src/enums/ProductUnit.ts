/**
 * Valid product unit identifiers used for measurements
 */
export type ProductUnitIds =
    | "TR" // Tray
    | "BX" // Box
    | "PK" // Pack
    | "BT" // Bottle
    | "KG" // Kilogram
    | "L"  // Liter
    | "PK" // Package
    | "JR" // Jar
    | "RL" // Roll
    | "BG" // Bag
    | "UN"; // Unit

/**
 * Properties that describe a product unit of measurement
 */
export type ProductUnitProps = {
    /** Unit identifier */
    id: ProductUnitIds;
    /** Short code for the unit */
    acronym: string;
    /** Human readable description */
    description: string;
};

/**
 * Standard units of measurement used in the bill of materials.
 * Each unit has an ID, acronym, and description.
 */
export const ProductUnit: {
    [id in ProductUnitIds]: ProductUnitProps;
} = {
    TR: {
        id: "TR",
        acronym: "TR",
        description: "Tray",
    },
    BX: {
        id: "BX",
        acronym: "BX",
        description: "Box",
    },
    PK: {
        id: "PK",
        acronym: "PK",
        description: "Pack",
    },
    BT: {
        id: "BT",
        acronym: "BT",
        description: "Bottle",
    },
    KG: {
        id: "KG",
        acronym: "KG",
        description: "Kilogram",
    },
    L: {
        id: "L",
        acronym: "L",
        description: "Liter",
    },
    JR: {
        id: "JR",
        acronym: "JR",
        description: "Jar",
    },
    RL: {
        id: "RL",
        acronym: "RL",
        description: "Roll",
    },
    BG: {
        id: "BG",
        acronym: "BG",
        description: "Bag",
    },
    UN: {
        id: "UN",
        acronym: "UN",
        description: "Unit",
    },
};