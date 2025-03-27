import { useEffect, useState } from "preact/hooks";
import { type IProduct, Product } from "@saitodisse/bom-recipe-calculator";
import {
  ProductUnit,
  type ProductUnitId,
} from "@saitodisse/bom-recipe-calculator";
import {
  ProductCategory,
  type ProductCategoryId,
} from "@saitodisse/bom-recipe-calculator";
import { PageProps } from "$fresh/server.ts";
import Lng from "./Lng.tsx";

export default function AddEditProduct(props: PageProps) {
  const defaultProduct: IProduct = {
    id: props.params.product_id === "NEW_PRODUCT_ID"
      ? ""
      : props.params.product_id,
    name: "",
    category: "" as ProductCategoryId,
    unit: "" as ProductUnitId,
    weight: null,
    purchaseQuoteValue: null,
    notes: null,
    recipe: null,
    imageUrl: null,
  };

  const [formData, setFormData] = useState<IProduct>(defaultProduct);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Load product categories and units
  const [categories, setCategories] = useState<ProductCategoryId[]>([]);
  const [units, setUnits] = useState<ProductUnitId[]>([]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Use the actual ProductCategory values from the interface
    const categoryIds: ProductCategoryId[] = Object.values(ProductCategory).map(
      (cat) => cat.id,
    );
    setCategories(categoryIds);

    // Get unit IDs from ProductUnit
    setUnits(Object.values(ProductUnit).map((unit) => unit.id));

    // Load product data if product_id is provided and not "NEW_PRODUCT_ID"
    if (
      props.params.product_id && props.params.product_id !== "NEW_PRODUCT_ID"
    ) {
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          const productToEdit = parsedProducts.find((p: IProduct) =>
            p.id === props.params.product_id
          );

          if (productToEdit) {
            setFormData(productToEdit);
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    }
  }, [props.params.product_id]);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    let parsedValue: string | number | null = value;

    // Handle numeric inputs
    if (type === "number") {
      parsedValue = value === "" ? null : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) {
      newErrors.id = "ID is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.unit) {
      newErrors.unit = "Unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Check for browser environment
      if (typeof window === "undefined") {
        return;
      }

      // Create a new Product instance to validate the data
      const product = new Product(formData);

      // Get existing products from localStorage
      const storedProducts = localStorage.getItem("products");
      let products: IProduct[] = storedProducts
        ? JSON.parse(storedProducts)
        : [];

      if (isEditing) {
        // Update existing product
        products = products.map((p) =>
          p.id === product.id ? product.toJSON() : p
        );
      } else {
        // Check for duplicate ID
        if (products.some((p) => p.id === product.id)) {
          setErrors({ id: "A product with this ID already exists" });
          return;
        }

        // Add new product
        products.push(product.toJSON());
      }

      // Save to localStorage
      localStorage.setItem("products", JSON.stringify(products));

      // Reset form
      setFormData(defaultProduct);
      setErrors({});

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("product-updated"));

      // Show success message
      alert(`Product ${isEditing ? "updated" : "added"} successfully!`);

      // Redirect to products list
      window.location.href = "/products/list-products";
    } catch (error) {
      console.error("Error saving product:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleCancel = () => {
    setFormData(defaultProduct);
    setErrors({});
    // Redirect to products list
    window.location.href = "/products/list-products";
  };

  // Handle server-side rendering
  if (typeof window === "undefined") {
    return (
      <div class="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
        <h2 class="text-2xl font-semibold mb-4">
          <Lng
            en="Add New Product"
            pt="Adicionar Novo Produto"
          />
        </h2>
        <p>
          <Lng
            en="Loading product form..."
            pt="Carregando formulário de produto..."
          />
        </p>
      </div>
    );
  }

  return (
    <div class="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
      <h2 class="text-2xl font-semibold mb-4">
        <Lng
          en={isEditing ? "Edit Product" : "Add New Product"}
          pt={isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
        />
      </h2>

      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID */}
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-1"
              htmlFor="id"
            >
              ID *
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={isEditing}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.id ? "border-destructive" : "border-border"
              }`}
            />
            {errors.id && <p class="mt-1 text-sm text-destructive">{errors.id}</p>}
          </div>

          {/* Name */}
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-1"
              htmlFor="name"
            >
              <Lng
                en="Name (*)"
                pt="Nome (*)"
              />
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-destructive" : "border-border"
              }`}
            />
            {errors.name && (
              <p class="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-1"
              htmlFor="category"
            >
              <Lng
                en="Category (*)"
                pt="Categoria (*)"
              />
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.category ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((categoryId) => {
                const category = Object.values(ProductCategory).find(
                  (c) => c.id === categoryId,
                );
                return (
                  <option key={categoryId} value={categoryId}>
                    {category ? category.description : categoryId}
                  </option>
                );
              })}
            </select>
            {errors.category && (
              <p class="mt-1 text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-1"
              htmlFor="unit"
            >
              <Lng
                en="Unit (*)"
                pt="Unidade (*)"
              />
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.unit ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select a unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p class="mt-1 text-sm text-destructive">{errors.unit}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-1"
              htmlFor="weight"
            >
              <Lng
                en="Weight (optional)"
                pt="Peso (opcional)"
              />
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight ?? ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>

          {/* Purchase Quote Value */}
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-1"
              htmlFor="purchaseQuoteValue"
            >
              <Lng
                en="Price (optional)"
                pt="Preço (opcional)"
              />
            </label>
            <input
              type="number"
              id="purchaseQuoteValue"
              name="purchaseQuoteValue"
              value={formData.purchaseQuoteValue ?? ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            class="block text-sm font-medium text-foreground mb-1"
            htmlFor="notes"
          >
            <Lng
              en="Notes (optional)"
              pt="Notas (opcional)"
            />
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes ?? ""}
            onChange={handleChange}
            rows={3}
            class="w-full px-3 py-2 border border-border rounded-md"
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            class="block text-sm font-medium text-foreground mb-1"
            htmlFor="imageUrl"
          >
            <Lng
              en="Image URL (optional)"
              pt="URL da imagem (opcional)"
            />
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl ?? ""}
            onChange={handleChange}
            class="w-full px-3 py-2 border border-border rounded-md"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            class="px-4 py-2 border border-border rounded-md text-foreground hover:bg-foreground/5"
          >
            <Lng
              en="Cancel"
              pt="Cancelar"
            />
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Lng
              en={isEditing ? "Update Product" : "Add Product"}
              pt={isEditing ? "Atualizar Produto" : "Adicionar Produto"}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
