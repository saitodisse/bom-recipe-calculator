import { useEffect, useState } from "preact/hooks";
import { Product } from "../../src/models/Product.ts";
import type { IProduct } from "../../src/interfaces/IProduct.ts";
import {
  ProductUnit,
  type ProductUnitId,
} from "../../src/interfaces/ProductUnit.ts";
import {
  ProductCategory,
  type ProductCategoryId,
} from "../../src/interfaces/ProductCategory.ts";
import { PageProps } from "$fresh/server.ts";

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
      <div class="my-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 class="text-2xl font-semibold mb-4">Add New Product</h2>
        <p>Loading product form...</p>
      </div>
    );
  }

  return (
    <div class="my-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 class="text-2xl font-semibold mb-4">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID */}
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
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
                errors.id ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.id && <p class="mt-1 text-sm text-red-500">{errors.id}</p>}
          </div>

          {/* Name */}
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p class="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="category"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.category ? "border-red-500" : "border-gray-300"
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
              <p class="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="unit"
            >
              Unit *
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              class={`w-full px-3 py-2 border rounded-md ${
                errors.unit ? "border-red-500" : "border-gray-300"
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
              <p class="mt-1 text-sm text-red-500">{errors.unit}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="weight"
            >
              Weight (optional)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight ?? ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Purchase Quote Value */}
          <div>
            <label
              class="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="purchaseQuoteValue"
            >
              Price (optional)
            </label>
            <input
              type="number"
              id="purchaseQuoteValue"
              name="purchaseQuoteValue"
              value={formData.purchaseQuoteValue ?? ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="notes"
          >
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes ?? ""}
            onChange={handleChange}
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
