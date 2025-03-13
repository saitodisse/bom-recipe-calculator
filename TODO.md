# TODO

## JSR Score Tasks (Current Score: 82%)

### Documentation

- [x] Add symbol documentation to improve coverage (currently only 7%
      documented, target is 80%)
- [x] Add a package description in package settings

### Runtime Compatibility

- [x] Mark at least one runtime as compatible in package settings
- [x] Make package compatible with at least two runtimes and mark them in
      settings

### Security & Trust

- [x] Set up CI/CD workflow for verifiable publishing and public transparency
      log entry

### Pending Tasks to Improve JSR Score

- [x] Add a package description in package settings
- [x] Mark at least one runtime as compatible (Deno/Node.js/Bun)
- [x] Mark at least two runtimes as compatible
- [x] Set up CI/CD workflow for verifiable publishing (provenance)

## Refatoração do createMaterialsTree usando Classes TypeScript

### Arquitetura Proposta

- [x] Adotar padrão de design Builder para construção da árvore de materiais
- [x] Implementar padrão Strategy para cálculos de custo e peso
- [x] Utilizar princípios SOLID para garantir código extensível e manutenível
- [x] Separar responsabilidades em classes específicas

### Estrutura de Classes

1. **Modelos de Dados**
   - [x] `Product`: Classe para representar um produto com suas propriedades
   - [x] `RecipeItem`: Classe para representar um item de receita
   - [x] `TreeNode`: Classe para representar um nó na árvore de materiais

2. **Serviços e Utilitários**
   - [x] `Calculator`: Classe para centralizar cálculos de custo e peso
   - [x] `TreeValidator`: Classe para validação de entradas e estrutura da
         árvore
   - [x] `Utils`: Classe com métodos utilitários (como arredondamento)

3. **Construtores e Gerenciadores**
   - [x] `MaterialsTreeBuilder`: Classe principal para construção da árvore
   - [x] `NodeProcessor`: Classe para processamento de nós individuais
   - [x] `TreeTraverser`: Classe para percorrer a árvore e aplicar operações

### Implementação Detalhada

1. **Fase 1: Definição de Classes Base**
   - [x] Criar interfaces e classes abstratas
   - [x] Definir contratos e tipos
   - [x] Estabelecer hierarquia de classes

2. **Fase 2: Implementação de Modelos**
   - [x] Implementar `Product` com validações e métodos auxiliares
   - [x] Implementar `RecipeItem` com lógica de cálculo de quantidade
   - [x] Implementar `TreeNode` com estrutura para armazenar dados e filhos

3. **Fase 3: Implementação de Serviços**
   - [x] Implementar `Calculator` com estratégias para diferentes tipos de
         cálculos
   - [x] Implementar `TreeValidator` com validações robustas
   - [x] Implementar `Utils` com funções de arredondamento e outras utilidades

4. **Fase 4: Implementação do Builder**
   - [x] Implementar `MaterialsTreeBuilder` com métodos fluentes
   - [x] Implementar `NodeProcessor` para processamento recursivo
   - [x] Implementar `TreeTraverser` para percorrer e manipular a árvore

### Testes e Documentação

- [x] Criar testes unitários para cada classe
- [x] Criar testes de integração para o fluxo completo
- [x] Documentar todas as classes e métodos com JSDoc
- [x] Criar exemplos de uso da nova API
- [x] Atualizar a documentação existente
- [x] Criar scripts para execução automatizada de testes

### Migração e Compatibilidade

- [x] Criar adaptadores para compatibilidade com a API antiga
- [x] Implementar função wrapper que mantém a assinatura original

### Otimizações

- [ ] Implementar cache para cálculos repetitivos
- [ ] Otimizar processamento recursivo para árvores grandes
- [ ] Adicionar suporte para processamento assíncrono quando necessário
- [x] Implementar mecanismos para evitar loops infinitos em receitas circulares

## Próximos Passos

1. **Testes**
   - [x] Implementar testes unitários para todas as classes
   - [x] Implementar testes de integração
   - [x] Criar scripts para execução de testes
   - [ ] Verificar cobertura de código

2. **Documentação**
   - [x] Atualizar README com exemplos da nova API
   - [x] Criar guia de migração para usuários existentes
   - [x] Documentar estratégias de extensão da API

3. **Otimizações**
   - [ ] Identificar e otimizar gargalos de desempenho
   - [ ] Implementar cache para cálculos repetitivos
   - [ ] Comparar desempenho com a implementação original

## Exemplos de Uso da API Refatorada

### Exemplo 1: Uso Básico com MaterialsTreeBuilder

```typescript
import { MaterialsTreeBuilder } from "./refactoring/builders/MaterialsTreeBuilder";
import type { IProduct } from "./refactoring/interfaces/IProduct";

// Lista de produtos
const productsList: Record<string, IProduct> = {
  flour: {
    id: "flour",
    name: "Wheat Flour",
    category: "m",
    unit: "KG",
    weight: 1,
    purchaseQuoteValue: 2.5,
    recipe: null,
  },
  water: {
    id: "water",
    name: "Water",
    category: "m",
    unit: "L",
    weight: 1,
    purchaseQuoteValue: 0.5,
    recipe: null,
  },
  dough: {
    id: "dough",
    name: "Basic Dough",
    category: "s",
    unit: "KG",
    weight: 2,
    purchaseQuoteValue: null,
    recipe: [
      { id: "flour", quantity: 1 },
      { id: "water", quantity: 0.5 },
    ],
  },
};

// Criar uma árvore de materiais para o produto "dough"
const builder = new MaterialsTreeBuilder({
  productsList,
  productCode: "dough",
  initialQuantity: 2, // Quantidade inicial
});

// Construir a árvore
const tree = builder.build();

// Acessar informações da árvore
console.log(tree["dough"].name); // "Basic Dough"
console.log(tree["dough"].calculatedQuantity); // 2
console.log(tree["dough"].children?.["flour"].calculatedQuantity); // 2
console.log(tree["dough"].children?.["water"].calculatedQuantity); // 1
```

### Exemplo 2: Uso do LegacyAdapter para Compatibilidade

```typescript
import { LegacyAdapter } from "./refactoring/adapters/LegacyAdapter";
import type { IProduct } from "./refactoring/interfaces/IProduct";

// Lista de produtos (mesma do exemplo anterior)
const productsList: Record<string, IProduct> = {
  // ... produtos aqui
};

// Usar o adaptador para manter compatibilidade com código existente
const tree = LegacyAdapter.createMaterialsTree({
  productsList,
  productCode: "dough",
  initialQuantity: 2,
});

// O resultado tem o mesmo formato da função original
console.log(tree["dough"].name); // "Basic Dough"
console.log(tree["dough"].calculatedQuantity); // 2
console.log(tree["dough"].children["flour"].calculatedQuantity); // 2
```

### Exemplo 3: Uso do TreeTraverser para Manipular a Árvore

```typescript
import { MaterialsTreeBuilder } from "./refactoring/builders/MaterialsTreeBuilder";
import { TreeTraverser } from "./refactoring/traversers/TreeTraverser";
import type { IProduct } from "./refactoring/interfaces/IProduct";

// Lista de produtos (mesma do exemplo anterior)
const productsList: Record<string, IProduct> = {
  // ... produtos aqui
};

// Criar e construir a árvore
const builder = new MaterialsTreeBuilder({
  productsList,
  productCode: "dough",
  initialQuantity: 1,
});
const tree = builder.build();

// Encontrar um nó específico na árvore
const flourNode = TreeTraverser.findNode(tree, "flour");
console.log(flourNode?.name); // "Wheat Flour"

// Calcular o custo total da árvore
const totalCost = TreeTraverser.calculateTotalCost(tree);
console.log(totalCost); // Soma de todos os custos

// Obter todos os nós folha (sem filhos)
const leafNodes = TreeTraverser.getLeafNodes(tree);
console.log(Object.keys(leafNodes || {})); // ["flour", "water"]

// Mapear nós para transformar seus valores
const uppercaseTree = TreeTraverser.mapNodes(tree, (node) => {
  // Criar um novo nó com o nome em maiúsculas
  return new TreeNode({
    ...node.toJSON(),
    name: node.name.toUpperCase(),
  });
});
console.log(uppercaseTree?.["dough"].name); // "BASIC DOUGH"
```

### Exemplo 4: Configuração Avançada com o Builder

```typescript
import { MaterialsTreeBuilder } from "./refactoring/builders/MaterialsTreeBuilder";
import type { IProduct } from "./refactoring/interfaces/IProduct";

// Lista de produtos
const productsList: Record<string, IProduct> = {
  // ... produtos aqui
};

// Configuração avançada usando métodos fluentes
const builder = new MaterialsTreeBuilder({
  productsList,
  productCode: "dough",
})
  .setInitialQuantity(3)
  .setMaxLevel(2) // Limitar a profundidade da árvore
  .setExtraProperties({
    createdAt: new Date(),
    createdBy: "user123",
    notes: "Produção especial",
  });

// Construir a árvore com as configurações personalizadas
const tree = builder.build();

// Acessar propriedades extras
console.log(tree["dough"].getExtraProperty("createdBy")); // "user123"
```
