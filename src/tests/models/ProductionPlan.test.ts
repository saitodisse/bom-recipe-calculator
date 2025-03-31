import {
  assertAlmostEquals,
  assertEquals,
  assertNotEquals,
} from "jsr:@std/assert";
import { ProductionPlan } from "../../models/ProductionPlan.ts";
import { testData } from "../testData.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.test("ProductionPlan - should create a new plan", () => {
  const plan = new ProductionPlan({
    name: "Test Plan",
  });

  assertNotEquals(plan.id, ""); // Should generate UUID
  assertEquals(plan.name, "Test Plan");
  assertEquals(plan.entries.length, 0);
});

Deno.test("ProductionPlan - should add and manage entries", async () => {
  const plan = new ProductionPlan({
    name: "Test Plan",
  });

  const date1 = new Date();
  plan.addEntry(
    testData.products.bread4pack,
    10,
    date1,
    "First batch",
    "Morning Batch",
  );

  await sleep(100); // Ensure dates are different

  const date2 = new Date();
  plan.addEntry(testData.products.breadUnitary, 20, date2);

  // Check entries were added
  assertEquals(plan.entries.length, 2);

  // Check first entry with name
  const entry1 = plan.entries[0];
  assertEquals(entry1.product.id, "bread4pack");
  assertEquals(entry1.product.productCode, undefined);
  assertEquals(entry1.plannedQuantity, 10);
  assertEquals(entry1.status, "planned");
  assertEquals(entry1.notes, "First batch");
  assertEquals(entry1.name, "Morning Batch");
  assertNotEquals(entry1.id, ""); // Should have a UUID

  // Check second entry without name
  const entry2 = plan.entries[1];
  assertEquals(entry2.product.id, "breadUnitary");
  assertEquals(entry2.product.productCode, undefined);
  assertEquals(entry2.plannedQuantity, 20);
  assertEquals(entry2.status, "planned");
  assertEquals(entry2.notes, undefined);
  assertEquals(entry2.name, undefined);
  assertNotEquals(entry2.id, ""); // Should have a UUID

  // Check status update using entry id
  plan.updateEntryStatus(entry1.id, "in-progress");
  assertEquals(plan.entries[0].status, "in-progress");

  // Check entry removal using entry id
  plan.removeEntry(entry1.id);
  assertEquals(plan.entries.length, 1);
  assertEquals(plan.entries[0].product.id, "breadUnitary");
  assertEquals(plan.entries[0].product.productCode, undefined);
});

Deno.test("ProductionPlan - should calculate materials needed", async () => {
  const plan = new ProductionPlan({
    name: "Test Plan",
  });

  // Add 10 units of 4-pack bread
  plan.addEntry(testData.products.bread4pack, 10, new Date());

  // Calculate materials needed
  const materialTrees = await plan.calculateMaterialsNeeded(
    testData.productLists.allProductsAndReceipes,
  );

  // Check some expected quantities
  // 10 units of bread4pack = 40 unitary breads
  assertEquals(materialTrees["breadUnitary"].calculatedQuantity, 40);

  // Each unitary bread needs 0.220kg of dough
  // So 40 unitary breads need 8.8kg of dough
  assertEquals(materialTrees["dough"].calculatedQuantity, 8.8);

  // For 8.8kg of dough we need:
  // - 4.4kg flour (0.5 * 8.8)
  // - 6.16L water (0.7 * 8.8)
  // - 0.0176kg salt (0.002 * 8.8)
  // - 0.0264kg yeast (0.003 * 8.8)
  assertEquals(materialTrees["flour"].calculatedQuantity, 4.4);
  assertEquals(materialTrees["water"].calculatedQuantity, 6.16);
  assertEquals(materialTrees["salt"].calculatedQuantity, 0.0176);
  assertAlmostEquals(materialTrees["yeast"].calculatedQuantity, 0.0264, 0.0001);

  // And 10 boxes for packaging
  assertEquals(materialTrees["box"].calculatedQuantity, 10);
});

Deno.test("ProductionPlan - should handle entry id and name correctly", () => {
  const plan = new ProductionPlan({
    name: "Test Plan",
  });

  // Add entries with different name configurations
  plan.addEntry(
    testData.products.bread4pack,
    10,
    new Date(),
    "Notes 1",
    "Named Entry",
  );
  plan.addEntry(testData.products.breadUnitary, 20, new Date(), "Notes 2"); // No name
  plan.addEntry(
    testData.products.dough,
    5,
    new Date(),
    undefined,
    "Dough Batch",
  ); // No notes, with name

  // Verify entries
  assertEquals(plan.entries.length, 3);

  // Check first entry (with name and notes)
  assertEquals(plan.entries[0].name, "Named Entry");
  assertEquals(plan.entries[0].notes, "Notes 1");
  assertNotEquals(plan.entries[0].id, "");

  // Check second entry (no name, with notes)
  assertEquals(plan.entries[1].name, undefined);
  assertEquals(plan.entries[1].notes, "Notes 2");
  assertNotEquals(plan.entries[1].id, "");

  // Check third entry (with name, no notes)
  assertEquals(plan.entries[2].name, "Dough Batch");
  assertEquals(plan.entries[2].notes, undefined);
  assertNotEquals(plan.entries[2].id, "");

  // Test updating by ID
  const entryId = plan.entries[0].id;
  plan.updateEntryStatus(entryId, "completed");
  assertEquals(plan.entries[0].status, "completed");

  // Test removing by ID
  plan.removeEntry(entryId);
  assertEquals(plan.entries.length, 2);
  assertEquals(plan.entries.find((e) => e.id === entryId), undefined);
});
