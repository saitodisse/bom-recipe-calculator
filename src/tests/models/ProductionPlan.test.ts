import { assertEquals, assertNotEquals, assertAlmostEquals } from "jsr:@std/assert";
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
  plan.addEntry(testData.products.bread4pack, 10, date1, "First batch");
  
  await sleep(100); // Ensure dates are different
  
  const date2 = new Date();
  plan.addEntry(testData.products.breadUnitary, 20, date2);

  // Check entries were added
  assertEquals(plan.entries.length, 2);
  assertEquals(plan.entries[0].product.id, "bread4pack");
  assertEquals(plan.entries[0].plannedQuantity, 10);
  assertEquals(plan.entries[0].status, "planned");
  assertEquals(plan.entries[0].notes, "First batch");
  
  assertEquals(plan.entries[1].product.id, "breadUnitary");
  assertEquals(plan.entries[1].plannedQuantity, 20);
  assertEquals(plan.entries[1].status, "planned");
  assertEquals(plan.entries[1].notes, undefined);

  // Check status update
  plan.updateEntryStatus(testData.products.bread4pack, date1, "in-progress");
  assertEquals(plan.entries[0].status, "in-progress");

  // Check entry removal
  plan.removeEntry(testData.products.bread4pack, date1);
  assertEquals(plan.entries.length, 1);
  assertEquals(plan.entries[0].product.id, "breadUnitary");
});

Deno.test("ProductionPlan - should calculate materials needed", async () => {
  const plan = new ProductionPlan({
    name: "Test Plan",
  });

  // Add 10 units of 4-pack bread
  plan.addEntry(testData.products.bread4pack, 10, new Date());
  
  // Calculate materials needed
  const materialTrees = await plan.calculateMaterialsNeeded(testData.productLists.allProductsAndReceipes);

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