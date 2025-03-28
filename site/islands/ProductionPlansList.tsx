import { useEffect, useState } from "preact/hooks";
import type { IProductionPlan, IProductionPlanEntry } from "@saitodisse/bom-recipe-calculator";
import { PageProps } from "$fresh/server.ts";
import Lng from "./Lng.tsx";
import { getStorageItem } from "../utils/storage.ts";
import { ContentLoading } from "../components/LoadingSpinner.tsx";

export default function ProductionPlansList(_props: PageProps) {
  const [plans, setPlans] = useState<IProductionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<string>("detailed");

  // Function to load plans from localStorage
  const loadPlans = () => {
    try {
      const savedPlans = getStorageItem("productionPlans");
      if (savedPlans) {
        const parsedPlans = JSON.parse(savedPlans);
        // Sort plans by creation date (newest first)
        parsedPlans.sort((a: IProductionPlan, b: IProductionPlan) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPlans(parsedPlans);
      } else {
        setPlans([]);
      }
      
      const savedViewMode = getStorageItem("productionPlansViewMode");
      if (savedViewMode) {
        setViewMode(savedViewMode);
      }
    } catch (error) {
      console.error("Error loading production plans:", error);
    } finally {
      // Always set loading to false, even if there's an error
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    loadPlans();

    // Handle browser back/forward navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadPlans();
      }
    };

    // Listen for page visibility changes (helps with back button)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", loadPlans);

    // Listen for plan updates
    window.addEventListener("production-plan-updated", loadPlans);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", loadPlans);
      window.removeEventListener("production-plan-updated", loadPlans);
    };
  }, []);

  const deletePlan = (planId: string): void => {
    if (confirm("Are you sure you want to delete this production plan?")) {
      try {
        const storedPlans = localStorage.getItem("productionPlans");
        if (storedPlans) {
          const parsedPlans = JSON.parse(storedPlans);
          const updatedPlans = parsedPlans.filter(
            (plan: IProductionPlan) => plan.id !== planId
          );
          localStorage.setItem("productionPlans", JSON.stringify(updatedPlans));
          setPlans(updatedPlans);
        }
      } catch (error) {
        console.error("Error deleting production plan:", error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status counts for a plan
  const getStatusCounts = (plan: IProductionPlan): Record<string, number> => {
    const counts: Record<string, number> = {
      planned: 0,
      "in-progress": 0,
      completed: 0,
      cancelled: 0,
    };
    
    plan.entries.forEach((entry: IProductionPlanEntry) => {
      counts[entry.status] = (counts[entry.status] || 0) + 1;
    });
    
    return counts;
  };

  // Render status badges
  const renderStatusBadges = (statusCounts: Record<string, number>) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {statusCounts.planned > 0 && (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            <Lng
              en={`${statusCounts.planned} Planned`}
              pt={`${statusCounts.planned} Planejados`}
            />
          </span>
        )}
        {statusCounts["in-progress"] > 0 && (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            <Lng
              en={`${statusCounts["in-progress"]} In Progress`}
              pt={`${statusCounts["in-progress"]} Em Progresso`}
            />
          </span>
        )}
        {statusCounts.completed > 0 && (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            <Lng
              en={`${statusCounts.completed} Completed`}
              pt={`${statusCounts.completed} Concluídos`}
            />
          </span>
        )}
        {statusCounts.cancelled > 0 && (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            <Lng
              en={`${statusCounts.cancelled} Cancelled`}
              pt={`${statusCounts.cancelled} Cancelados`}
            />
          </span>
        )}
      </div>
    );
  };

  // Render action buttons
  const renderActionButtons = (planId: string) => {
    return (
      <div className="flex space-x-2">
        <a
          href={`/production-plans/${planId}`}
          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </a>
        <button
          onClick={() => deletePlan(planId)}
          className="p-2 text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    );
  };

  // Handle server-side rendering
  if (typeof window === "undefined") {
    return (
      <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
        <ContentLoading />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
        <ContentLoading />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm text-center">
        <p className="text-lg mb-4">
          <Lng
            en="No production plans found"
            pt="Nenhum plano de produção encontrado"
          />
        </p>
        <a
          href="/production-plans/NEW_PLAN_ID"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Lng
            en="Create your first production plan"
            pt="Crie seu primeiro plano de produção"
          />
        </a>
      </div>
    );
  }

  // Detailed view (default)
  if (viewMode === "detailed") {
    return (
      <div className="space-y-6">
        {plans.map((plan) => {
          const statusCounts = getStatusCounts(plan);
          const productionDate = plan.entries.length > 0 
            ? new Date(plan.entries[0].productionDate) 
            : null;
          
          return (
            <div
              key={plan.id}
              className="p-6 bg-background text-foreground border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    <Lng
                      en={`Created: ${formatDate(plan.createdAt.toString())}`}
                      pt={`Criado em: ${formatDate(plan.createdAt.toString())}`}
                    />
                  </p>
                  {productionDate && (
                    <p className="text-sm text-gray-500 mb-2">
                      <Lng
                        en={`Production Date: ${formatDate(productionDate.toString())}`}
                        pt={`Data de Produção: ${formatDate(productionDate.toString())}`}
                      />
                    </p>
                  )}
                  <p className="text-sm mb-3">
                    <Lng
                      en={`${plan.entries.length} products in this plan`}
                      pt={`${plan.entries.length} produtos neste plano`}
                    />
                  </p>
                  
                  {/* Status badges */}
                  {renderStatusBadges(statusCounts)}
                </div>
                
                {/* Action buttons */}
                {renderActionButtons(plan.id)}
              </div>
              
              {/* Products list */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  <Lng
                    en="Products in this plan:"
                    pt="Produtos neste plano:"
                  />
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {plan.entries.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center text-sm">
                      <span>{entry.product.name}</span>
                      <div className="flex items-center">
                        <span className="mr-2">{entry.plannedQuantity}</span>
                        <span className="text-gray-500">{entry.product.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Cards view
  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const statusCounts = getStatusCounts(plan);
          const productionDate = plan.entries.length > 0 
            ? new Date(plan.entries[0].productionDate) 
            : null;
          
          return (
            <div
              key={plan.id}
              className="p-4 bg-background text-foreground border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                {renderActionButtons(plan.id)}
              </div>
              
              {productionDate && (
                <p className="text-xs text-gray-500 mb-2">
                  <Lng
                    en={`Production: ${formatDate(productionDate.toString())}`}
                    pt={`Produção: ${formatDate(productionDate.toString())}`}
                  />
                </p>
              )}
              
              <p className="text-xs text-gray-500 mb-2">
                <Lng
                  en={`Created: ${formatDate(plan.createdAt.toString())}`}
                  pt={`Criado: ${formatDate(plan.createdAt.toString())}`}
                />
              </p>
              
              {/* Status badges */}
              <div className="mb-3">
                {renderStatusBadges(statusCounts)}
              </div>
              
              {/* Products preview */}
              <div className="mt-auto">
                <p className="text-xs font-medium mb-1 text-gray-600">
                  <Lng
                    en={`${plan.entries.length} products`}
                    pt={`${plan.entries.length} produtos`}
                  />
                </p>
                <div className="text-xs text-gray-600 truncate">
                  {plan.entries.slice(0, 2).map((entry, i) => (
                    <span key={entry.id}>
                      {i > 0 && ", "}
                      {entry.product.name} ({entry.plannedQuantity} {entry.product.unit})
                    </span>
                  ))}
                  {plan.entries.length > 2 && (
                    <span> ... +{plan.entries.length - 2} more</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Table view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-background text-foreground">
        <thead className="bg-background text-foreground">
          <tr>
            <th className="py-2 px-4 border-b text-left">
              <Lng
                en="Plan Name"
                pt="Nome do Plano"
              />
            </th>
            <th className="py-2 px-4 border-b text-left">
              <Lng
                en="Production Date"
                pt="Data de Produção"
              />
            </th>
            <th className="py-2 px-4 border-b text-left">
              <Lng
                en="Products"
                pt="Produtos"
              />
            </th>
            <th className="py-2 px-4 border-b text-left">
              <Lng
                en="Status"
                pt="Status"
              />
            </th>
            <th className="py-2 px-4 border-b text-left">
              <Lng
                en="Created"
                pt="Criado"
              />
            </th>
            <th className="py-2 px-4 border-b text-center">
              <Lng
                en="Actions"
                pt="Ações"
              />
            </th>
          </tr>
        </thead>
        <tbody className="bg-background text-foreground">
          {plans.map((plan) => {
            const statusCounts = getStatusCounts(plan);
            const productionDate = plan.entries.length > 0 
              ? new Date(plan.entries[0].productionDate) 
              : null;
            
            return (
              <tr key={plan.id} className="hover:bg-foreground/5">
                <td className="py-2 px-4 border-b font-medium">
                  {plan.name}
                </td>
                <td className="py-2 px-4 border-b">
                  {productionDate ? formatDate(productionDate.toString()) : "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {plan.entries.length}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex flex-wrap gap-1">
                    {statusCounts.planned > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        {statusCounts.planned} <Lng en="P" pt="P" />
                      </span>
                    )}
                    {statusCounts["in-progress"] > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {statusCounts["in-progress"]} <Lng en="IP" pt="EP" />
                      </span>
                    )}
                    {statusCounts.completed > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                        {statusCounts.completed} <Lng en="C" pt="C" />
                      </span>
                    )}
                    {statusCounts.cancelled > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                        {statusCounts.cancelled} <Lng en="X" pt="X" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {formatDate(plan.createdAt.toString())}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="flex justify-center space-x-2">
                    <a
                      href={`/production-plans/${plan.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <Lng
                        en="Edit"
                        pt="Editar"
                      />
                    </a>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <Lng
                        en="Delete"
                        pt="Deletar"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
