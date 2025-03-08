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

export type ProductUnitProps = {
    id: ProductUnitIds;
    code: string;
    description: string;
};

export const ProductUnit: {
    [id in ProductUnitIds]: ProductUnitProps;
} = {
    TR: {
        id: "TR",
        code: "TR",
        description: "Tray",
    },
    BX: {
        id: "BX",
        code: "BX",
        description: "Box",
    },
    PK: {
        id: "PK",
        code: "PK",
        description: "Pack",
    },
    BT: {
        id: "BT",
        code: "BT",
        description: "Bottle",
    },
    KG: {
        id: "KG",
        code: "KG",
        description: "Kilogram",
    },
    L: {
        id: "L",
        code: "L",
        description: "Liter",
    },
    JR: {
        id: "JR",
        code: "JR",
        description: "Jar",
    },
    RL: {
        id: "RL",
        code: "RL",
        description: "Roll",
    },
    BG: {
        id: "BG",
        code: "BG",
        description: "Bag",
    },
    UN: {
        id: "UN",
        code: "UN",
        description: "Unit",
    },
};