# Class Diagram for createMaterialsTree Refactoring

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

    %% Data Models
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

    %% Services and Utilities
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

    %% Builders and Managers
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

    %% Relationships
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
    
    TreeTraverser --> TreeNode : traverses
```

## Architecture Description

The proposed architecture follows SOLID principles and uses design patterns such
as Builder and Strategy to create a modular and extensible solution.

### Main Components

1. **Data Models**
   - `Product`: Represents a product with all its properties and helper methods
   - `RecipeItem`: Represents a recipe item with quantity and calculation
     methods
   - `TreeNode`: Represents a node in the materials tree, with calculated
     properties

2. **Services and Utilities**
   - `Calculator`: Centralizes all cost and weight calculations
   - `TreeValidator`: Performs validations at different levels of the tree
   - `Utils`: Provides utility functions such as rounding and ID generation

3. **Builders and Managers**
   - `MaterialsTreeBuilder`: Implements the Builder pattern for tree
     construction
   - `NodeProcessor`: Processes individual nodes and manages recursion
   - `TreeTraverser`: Provides methods to traverse and manipulate the tree

### Execution Flow

1. The client instantiates a `MaterialsTreeBuilder` with the necessary
   parameters
2. The builder configures the options and delegates tree creation to the
   `NodeProcessor`
3. The `NodeProcessor` creates the root node and recursively processes the
   children
4. The `Calculator` is used to perform cost and weight calculations
5. The `TreeValidator` validates the structure at different points
6. The final result is a tree of `TreeNode` objects that can be converted to
   JSON

### Advantages of the New Architecture

1. **Separation of Concerns**: Each class has a single responsibility
2. **Extensibility**: Easy to add new types of calculations or validations
3. **Testability**: Small, focused classes are easier to test
4. **Maintainability**: More organized and readable code
5. **Reusability**: Components can be reused in other contexts
