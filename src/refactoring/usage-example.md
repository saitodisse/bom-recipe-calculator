# Exemplos de Uso da Nova API

Este documento demonstra como utilizar a nova API orientada a objetos para criar
árvores de materiais.

## Exemplo Básico

```typescript
import { MaterialsTreeBuilder } from "./MaterialsTreeBuilder";
import { Product } from "./models/Product";
import { ProductUnit } from "../enums/ProductUnit";
import { ProductCategory } from "../enums/ProductCategory";

// Definir produtos
const flour = new Product({
  id: "flour",
  name: "Wheat Flour",
  category: ProductCategory.m.id,
  unit: ProductUnit.KG.id,
  weight: 1,
  purchaseQuoteValue: 2.5,
});

const water = new Product({
  id: "water",
  name: "Water",
  category: ProductCategory.m.id,
  unit: ProductUnit.L.id,
  weight: 1,
  purchaseQuoteValue: 0.5,
});

const dough = new Product({
  id: "dough",
  name: "Basic Dough",
  category: ProductCategory.s.id,
  unit: ProductUnit.KG.id,
  weight: 2,
  purchaseQuoteValue: null,
  recipe: [
    { id: "flour", quantity: 1 },
    { id: "water", quantity: 0.5 },
  ],
});

const bread = new Product({
  id: "bread",
  name: "White Bread",
  category: ProductCategory.p.id,
  unit: ProductUnit.UN.id,
  weight: 0.5,
  purchaseQuoteValue: 5,
  recipe: [
    { id: "dough", quantity: 0.5 },
  ],
});

// Criar mapa de produtos
const productsList = {
  "flour": flour,
  "water": water,
  "dough": dough,
  "bread": bread,
};

// Criar árvore de materiais
const materialsTree = new MaterialsTreeBuilder({
  productsList,
  productCode: "bread",
  initialQuantity: 10,
}).build();

// Acessar informações da árvore
console.log(`Produto: ${materialsTree.bread.getName()}`);
console.log(`Custo total: ${materialsTree.bread.getCalculatedCost()}`);
console.log(`Peso total: ${materialsTree.bread.getChildrenWeight()}`);

// Percorrer a árvore
import { TreeTraverser } from "./TreeTraverser";

TreeTraverser.traverse(materialsTree, (node) => {
  console.log(`Nó: ${node.getName()}, Nível: ${node.getLevel()}`);
});

// Encontrar um nó específico
const flourNode = TreeTraverser.findNode(materialsTree, "flour");
if (flourNode) {
  console.log(`Quantidade de farinha: ${flourNode.getCalculatedQuantity()} kg`);
}
```

## Exemplo com Adaptador de Compatibilidade

```typescript
import { LegacyAdapter } from "./adapters/LegacyAdapter";

// Usar a API antiga
const legacyTree = LegacyAdapter.createMaterialsTree({
  productsList,
  productCode: "bread",
  initialQuantity: 10,
});

// O resultado é compatível com o formato antigo
console.log(legacyTree.bread.calculatedCost);
console.log(legacyTree.bread.children.dough.calculatedQuantity);
```

## Exemplo com Configurações Avançadas

```typescript
// Configuração avançada usando o padrão Builder
const advancedTree = new MaterialsTreeBuilder({
  productsList,
  productCode: "bread",
})
  .setInitialQuantity(10)
  .setMaxLevel(5) // Limitar profundidade da árvore
  .setExtraProperties({
    date: new Date(),
    batchNumber: "B12345",
    operator: "John Doe",
  })
  .build();

// Acessar propriedades extras
console.log(`Data: ${advancedTree.bread.date}`);
console.log(`Lote: ${advancedTree.bread.batchNumber}`);
```

## Exemplo com Cálculos Personalizados

```typescript
import { Calculator } from "./services/Calculator";
import { TreeNode } from "./models/TreeNode";

// Estender a classe Calculator para adicionar cálculos personalizados
class CustomCalculator extends Calculator {
  static calculateProfit(node: TreeNode, sellingPrice: number): number {
    const cost = node.getCalculatedCost() || 0;
    return this.roundToThreeDecimals(sellingPrice - cost);
  }
}

// Usar o calculador personalizado
const breadNode = materialsTree.bread;
const sellingPrice = 80; // Para 10 pães
const profit = CustomCalculator.calculateProfit(breadNode, sellingPrice);
console.log(`Lucro: ${profit}`);
```

## Exemplo com Validação Personalizada

```typescript
import { TreeValidator } from "./services/TreeValidator";

// Estender a classe TreeValidator para adicionar validações personalizadas
class CustomValidator extends TreeValidator {
  static validateProfitMargin(
    node: TreeNode,
    sellingPrice: number,
    minMargin: number,
  ): boolean {
    const cost = node.getCalculatedCost() || 0;
    if (cost === 0) return true;

    const margin = (sellingPrice - cost) / cost;
    if (margin < minMargin) {
      throw new Error(
        `Margem de lucro insuficiente: ${margin * 100}% (mínimo: ${
          minMargin * 100
        }%)`,
      );
    }
    return true;
  }
}

// Usar o validador personalizado
try {
  CustomValidator.validateProfitMargin(breadNode, sellingPrice, 0.3); // 30% de margem mínima
  console.log("Margem de lucro válida!");
} catch (error) {
  console.error(error.message);
}
```
