# Diagrama de Classes para Refatoração do createMaterialsTree

```mermaid
classDiagram
    %% Interfaces
    class IProduct {
        <<interface>>
        +string id
        +string name
        +ProductCategoryId category
        +ProductUnitId unit
        +number? weight
        +number? purchaseQuoteValue
        +string? notes
        +RecipeItem[]? recipe
    }

    class IRecipeItem {
        <<interface>>
        +string id
        +number quantity
    }

    class ITreeNode {
        <<interface>>
        +string id
        +string name
        +string unit
        +number level
        +number motherFactor
        +number? quantity
        +number originalQuantity
        +number calculatedQuantity
        +number weight
        +number childrenWeight
        +number? originalCost
        +number? calculatedCost
        +Map~string, ITreeNode~? children
    }

    %% Modelos de Dados
    class Product {
        -string _id
        -string _name
        -ProductCategoryId _category
        -ProductUnitId _unit
        -number? _weight
        -number? _purchaseQuoteValue
        -string? _notes
        -RecipeItem[]? _recipe
        +constructor(data: IProduct)
        +getId(): string
        +getName(): string
        +getCategory(): ProductCategoryId
        +getUnit(): ProductUnitId
        +getWeight(): number?
        +getPurchaseQuoteValue(): number?
        +getNotes(): string?
        +getRecipe(): RecipeItem[]?
        +hasRecipe(): boolean
        +isKilogram(): boolean
    }

    class RecipeItem {
        -string _id
        -number _quantity
        +constructor(id: string, quantity: number)
        +getId(): string
        +getQuantity(): number
        +calculateWithFactor(factor: number): number
    }

    class TreeNode {
        -string _id
        -string _name
        -string _unit
        -number _level
        -number _motherFactor
        -number? _quantity
        -number _originalQuantity
        -number _calculatedQuantity
        -number _weight
        -number _childrenWeight
        -number? _originalCost
        -number? _calculatedCost
        -Map~string, TreeNode~? _children
        +constructor(data: Partial~ITreeNode~)
        +getId(): string
        +getName(): string
        +getUnit(): string
        +getLevel(): number
        +getMotherFactor(): number
        +getQuantity(): number?
        +getOriginalQuantity(): number
        +getCalculatedQuantity(): number
        +getWeight(): number
        +getChildrenWeight(): number
        +getOriginalCost(): number?
        +getCalculatedCost(): number?
        +getChildren(): Map~string, TreeNode~?
        +setChildrenWeight(weight: number): void
        +setCalculatedCost(cost: number): void
        +addChild(node: TreeNode): void
        +toJSON(): object
    }

    %% Serviços e Utilitários
    class Calculator {
        +static roundToThreeDecimals(value: number): number
        +static calculateItemCost(quantity: number, factor: number, unitCost: number): number
        +static calculateItemWeight(quantity: number, factor: number, unitWeight: number): number
        +static calculateTotalChildrenWeight(children: Map~string, TreeNode~): number
        +static calculateTotalChildrenCost(children: Map~string, TreeNode~): number
    }

    class TreeValidator {
        +static validateProduct(product: Product): void
        +static validateRecipeItem(item: RecipeItem): void
        +static validateTreeNode(node: TreeNode): void
        +static checkForCircularDependencies(productsList: Map~string, Product~, productCode: string, path: string[]): void
    }

    class Utils {
        +static roundToThreeDecimals(value: number): number
        +static generateNodeId(id: string, motherId: string): string
        +static generateNodePath(motherPath: string, id: string): string
    }

    %% Construtores e Gerenciadores
    class MaterialsTreeBuilder {
        -Map~string, Product~ _productsList
        -string _productCode
        -number _initialQuantity
        -object _extraPropertiesForMother
        -number _maxLevel
        +constructor(params: ICreateMaterialsTreeParams)
        +setProductsList(productsList: Map~string, Product~): MaterialsTreeBuilder
        +setProductCode(productCode: string): MaterialsTreeBuilder
        +setInitialQuantity(quantity: number): MaterialsTreeBuilder
        +setExtraProperties(props: object): MaterialsTreeBuilder
        +setMaxLevel(maxLevel: number): MaterialsTreeBuilder
        +build(): TreeNode
    }

    class NodeProcessor {
        -Map~string, Product~ _productsList
        -number _maxLevel
        +constructor(productsList: Map~string, Product~, maxLevel: number)
        +processRootNode(product: Product, initialQuantity: number, extraProps: object): TreeNode
        +processChildNode(item: RecipeItem, motherFactor: number, motherId: string, motherPath: string, level: number): TreeNode
        -createNode(product: Product, params: object): TreeNode
    }

    class TreeTraverser {
        +static traverse(node: TreeNode, callback: Function): void
        +static findNode(node: TreeNode, id: string): TreeNode?
        +static mapNode(node: TreeNode, mapFn: Function): TreeNode
        +static filterNode(node: TreeNode, filterFn: Function): TreeNode?
    }

    %% Adaptadores
    class LegacyAdapter {
        +static createMaterialsTree(params: ICreateMaterialsTreeParams, ...args): object
        -static convertToLegacyFormat(node: TreeNode): object
    }

    %% Relações
    IProduct <|.. Product
    IRecipeItem <|.. RecipeItem
    ITreeNode <|.. TreeNode
    
    Product "1" *-- "0..*" RecipeItem : contains
    TreeNode "1" *-- "0..*" TreeNode : contains
    
    MaterialsTreeBuilder --> NodeProcessor : uses
    MaterialsTreeBuilder --> TreeValidator : uses
    NodeProcessor --> Calculator : uses
    NodeProcessor --> Utils : uses
    NodeProcessor --> TreeNode : creates
    NodeProcessor --> Product : processes
    NodeProcessor --> RecipeItem : processes
    
    LegacyAdapter --> MaterialsTreeBuilder : uses
    TreeTraverser --> TreeNode : traverses
```

## Descrição da Arquitetura

A arquitetura proposta segue os princípios SOLID e utiliza padrões de design
como Builder e Strategy para criar uma solução modular e extensível.

### Principais Componentes

1. **Modelos de Dados**
   - `Product`: Representa um produto com todas suas propriedades e métodos
     auxiliares
   - `RecipeItem`: Representa um item de receita com quantidade e métodos de
     cálculo
   - `TreeNode`: Representa um nó na árvore de materiais, com propriedades
     calculadas

2. **Serviços e Utilitários**
   - `Calculator`: Centraliza todos os cálculos de custo e peso
   - `TreeValidator`: Realiza validações em diferentes níveis da árvore
   - `Utils`: Fornece funções utilitárias como arredondamento e geração de IDs

3. **Construtores e Gerenciadores**
   - `MaterialsTreeBuilder`: Implementa o padrão Builder para construção da
     árvore
   - `NodeProcessor`: Processa nós individuais e gerencia a recursão
   - `TreeTraverser`: Fornece métodos para percorrer e manipular a árvore

4. **Adaptadores**
   - `LegacyAdapter`: Mantém compatibilidade com a API antiga

### Fluxo de Execução

1. O cliente instancia um `MaterialsTreeBuilder` com os parâmetros necessários
2. O builder configura as opções e delega a criação da árvore para o
   `NodeProcessor`
3. O `NodeProcessor` cria o nó raiz e processa recursivamente os filhos
4. O `Calculator` é usado para realizar cálculos de custo e peso
5. O `TreeValidator` valida a estrutura em diferentes pontos
6. O resultado final é uma árvore de objetos `TreeNode` que pode ser convertida
   para JSON

### Vantagens da Nova Arquitetura

1. **Separação de Responsabilidades**: Cada classe tem uma responsabilidade
   única
2. **Extensibilidade**: Fácil adicionar novos tipos de cálculos ou validações
3. **Testabilidade**: Classes pequenas e focadas são mais fáceis de testar
4. **Manutenibilidade**: Código mais organizado e legível
5. **Reutilização**: Componentes podem ser reutilizados em outros contextos
