import { useEffect, useState } from "preact/hooks";
import type { IProduct } from "@saitodisse/bom-recipe-calculator";
import type { 
  IProductionPlan, 
  IProductionPlanEntry 
} from "@saitodisse/bom-recipe-calculator";
import { ProductionPlan } from "@saitodisse/bom-recipe-calculator";
import { PageProps } from "$fresh/server.ts";
import Lng from "./Lng.tsx";
import { ContentLoading } from "../components/LoadingSpinner.tsx";

interface ProductQuantity {
  productId: string;
  quantity: number;
}

export default function AddEditProductionPlan(props: PageProps) {
  const defaultPlan: Partial<IProductionPlan> = {
    id: props.params.plan_id === "NEW_PLAN_ID" ? "" : props.params.plan_id,
    name: "",
    entries: [],
  };

  const [formData, setFormData] = useState<Partial<IProductionPlan>>(defaultPlan);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedProducts, setSelectedProducts] = useState<ProductQuantity[]>([
    { productId: "", quantity: 1 },
  ]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Load products from localStorage
    try {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }

    // Load plan data if plan_id is provided and not "NEW_PLAN_ID"
    if (props.params.plan_id && props.params.plan_id !== "NEW_PLAN_ID") {
      try {
        const storedPlans = localStorage.getItem("productionPlans");
        if (storedPlans) {
          const parsedPlans = JSON.parse(storedPlans);
          const planToEdit = parsedPlans.find((p: IProductionPlan) =>
            p.id === props.params.plan_id
          );

          if (planToEdit) {
            setFormData(planToEdit);
            
            // Extract date from the first entry (assuming all entries have same date)
            if (planToEdit.entries && planToEdit.entries.length > 0) {
              const date = new Date(planToEdit.entries[0].productionDate);
              setSelectedDate(date.toISOString().split("T")[0]);
              
              // Convert entries to selectedProducts format
              const productQuantities = planToEdit.entries.map((entry: IProductionPlanEntry) => ({
                productId: entry.product.id,
                quantity: entry.plannedQuantity
              }));
              setSelectedProducts(productQuantities);
            }
            
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error("Error loading production plan:", error);
      }
    }
  }, [props.params.plan_id]);

  const handleNameChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    setFormData((prev) => ({
      ...prev,
      name: value,
    }));

    // Clear error for this field if it exists
    if (errors.name) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const handleDateChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setSelectedDate(target.value);
  };

  const handleProductChange = (index: number, e: Event) => {
    const target = e.target as HTMLSelectElement;
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].productId = target.value;
    setSelectedProducts(updatedProducts);
  };

  const handleQuantityChange = (index: number, e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value === "" ? 0 : Number(target.value);
    
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = value;
    setSelectedProducts(updatedProducts);
  };

  const addProductRow = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: 1 }]);
  };

  const removeProductRow = (index: number) => {
    if (selectedProducts.length > 1) {
      const updatedProducts = [...selectedProducts];
      updatedProducts.splice(index, 1);
      setSelectedProducts(updatedProducts);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!selectedDate) {
      newErrors.date = "Production date is required";
    }

    // Check if at least one product is selected
    const hasValidProduct = selectedProducts.some(
      (item) => item.productId && item.quantity > 0
    );
    
    if (!hasValidProduct) {
      newErrors.products = "At least one product with quantity must be selected";
    }

    // Check for duplicate products
    const productIds = selectedProducts
      .filter(p => p.productId)
      .map(p => p.productId);
    
    const hasDuplicates = productIds.length !== new Set(productIds).size;
    if (hasDuplicates) {
      newErrors.duplicates = "Duplicate products are not allowed";
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

      // Convert selected products to production plan entries
      const entries: IProductionPlanEntry[] = selectedProducts
        .filter((item: ProductQuantity) => item.productId && item.quantity > 0)
        .map((item: ProductQuantity) => {
          const product = products.find((p: IProduct) => p.id === item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          
          return {
            id: crypto.randomUUID(),
            product,
            plannedQuantity: item.quantity,
            productionDate: new Date(selectedDate),
            status: "planned" as const,
          };
        });

      // Create a new ProductionPlan instance
      const planData: Partial<IProductionPlan> = {
        ...formData,
        entries,
      };
      
      const productionPlan = new ProductionPlan(planData);

      // Get existing plans from localStorage
      const storedPlans = localStorage.getItem("productionPlans");
      let plans: IProductionPlan[] = storedPlans
        ? JSON.parse(storedPlans)
        : [];

      if (isEditing) {
        // Update existing plan
        plans = plans.map((p) =>
          p.id === productionPlan.id ? productionPlan.toJSON() : p
        );
      } else {
        // Add new plan
        plans.push(productionPlan.toJSON());
      }

      // Save to localStorage
      localStorage.setItem("productionPlans", JSON.stringify(plans));

      // Reset form
      setFormData(defaultPlan);
      setErrors({});
      setSelectedProducts([{ productId: "", quantity: 1 }]);

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("production-plan-updated"));

      // Show success message
      alert(`Production plan ${isEditing ? "updated" : "added"} successfully!`);

      // Redirect to plans list
      window.location.href = "/production-plans/list-plans";
    } catch (error) {
      console.error("Error saving production plan:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleCancel = () => {
    setFormData(defaultPlan);
    setErrors({});
    // Redirect to plans list
    window.location.href = "/production-plans/list-plans";
  };

  // Handle server-side rendering
  if (typeof window === "undefined") {
    return (
      <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
        <ContentLoading />
      </div>
    );
  }

  return (
    <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">
        <Lng
          en={isEditing ? "Edit Production Plan" : "Add New Production Plan"}
          pt={isEditing ? "Editar Plano de Produção" : "Adicionar Novo Plano de Produção"}
        />
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1"
          >
            <Lng
              en="Plan Name"
              pt="Nome do Plano"
            />
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            className={`w-full p-2 border ${
              errors.name ? "border-red-500" : "border-border"
            } rounded-md bg-background text-foreground`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Production Date */}
        <div>
          <label
            htmlFor="productionDate"
            className="block text-sm font-medium text-foreground mb-1"
          >
            <Lng
              en="Production Date"
              pt="Data de Produção"
            />
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="productionDate"
            name="productionDate"
            value={selectedDate}
            onChange={handleDateChange}
            className={`w-full p-2 border ${
              errors.date ? "border-red-500" : "border-border"
            } rounded-md bg-background text-foreground`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Products Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-foreground">
              <Lng
                en="Products to Produce"
                pt="Produtos a Produzir"
              />
              <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addProductRow}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              <Lng
                en="+ Add Product"
                pt="+ Adicionar Produto"
              />
            </button>
          </div>
          
          {errors.products && (
            <p className="text-red-500 text-sm mb-2">{errors.products}</p>
          )}
          
          {errors.duplicates && (
            <p className="text-red-500 text-sm mb-2">{errors.duplicates}</p>
          )}
          
          <div className="space-y-3">
            {selectedProducts.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-grow">
                  <select
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, e)}
                    className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">
                      <Lng
                        en="-- Select Product --"
                        pt="-- Selecionar Produto --"
                      />
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e)}
                    className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="Qty"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProductRow(index)}
                  disabled={selectedProducts.length <= 1}
                  className={`p-2 rounded-md ${
                    selectedProducts.length <= 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-gray-100 transition-colors"
          >
            <Lng
              en="Cancel"
              pt="Cancelar"
            />
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Lng
              en={isEditing ? "Update Plan" : "Create Plan"}
              pt={isEditing ? "Atualizar Plano" : "Criar Plano"}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
