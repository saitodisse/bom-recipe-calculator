import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import Lng from "../../islands/Lng.tsx";
import ProductionPlansList from "../../islands/ProductionPlansList.tsx";
import ChangeProductionPlansViewMode from "../../islands/ChangeProductionPlansViewMode.tsx";

export default function ListProductionPlans(props: PageProps) {
  return (
    <>
      <Head>
        <title>Production Plans</title>
      </Head>
      <div className="max-w-screen-md m-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-foreground bg-background">
            <Lng
              en="Production Plans"
              pt="Planos de Produção"
            />
          </h1>
          <div className="flex items-center space-x-4">
            <ChangeProductionPlansViewMode />
            <a
              href="/production-plans/NEW_PLAN_ID"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Lng
                en="Add New Plan"
                pt="Adicionar Novo Plano"
              />
            </a>
          </div>
        </div>
        <ProductionPlansList {...props} />
      </div>
    </>
  );
}
