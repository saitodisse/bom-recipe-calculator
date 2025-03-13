/**
 * Interface representing a node in the materials tree.
 * Contains both the original values and calculated results.
 */
export interface ITreeNode {
  /** Unique identifier for the node */
  id: string;

  /** Display name of the product */
  name: string;

  /** Unit of measurement for the product */
  unit: string;

  /** Depth level in the recipe tree (0 for root) */
  level: number;

  /** Multiplication factor from parent recipe */
  motherFactor: number;

  /** Current quantity (null for root node) */
  quantity: number | null;

  /** Original quantity from recipe */
  originalQuantity: number;

  /** Quantity after applying all multiplication factors */
  calculatedQuantity: number;

  /** Original weight per unit */
  weight: number;

  /** Total weight including all children */
  childrenWeight: number;

  /** Original cost per unit */
  originalCost: number | null;

  /** Total calculated cost including children */
  calculatedCost: number | null;

  /** Child nodes in the recipe tree */
  children: Record<string, any> | null;

  /** Additional properties that can be added to the node */
  [key: string]: unknown;
}
