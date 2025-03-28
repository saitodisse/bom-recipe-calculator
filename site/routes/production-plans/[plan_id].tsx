import { Head } from "$fresh/runtime.ts";
import AddEditProductionPlan from "../../islands/AddEditProductionPlan.tsx";
import { PageProps } from "$fresh/server.ts";
import Lng from "../../islands/Lng.tsx";

export default function ProductionPlanDetail(props: PageProps) {
  const isNewPlan = props.params.plan_id === "NEW_PLAN_ID";

  return (
    <>
      <Head>
        <title>
          {isNewPlan ? "Add New Production Plan" : "Edit Production Plan"}
        </title>
      </Head>
      <div class="max-w-screen-md m-auto p-4">
        <h1 class="text-4xl font-bold mb-6 text-foreground bg-background">
          <Lng
            en={isNewPlan ? "Add New Production Plan" : "Edit Production Plan"}
            pt={isNewPlan ? "Adicionar Novo Plano de Produção" : "Editar Plano de Produção"}
          />
        </h1>
        <a
          href="/production-plans/list-plans"
          class="text-blue-500 hover:underline mb-4 inline-block"
        >
          <Lng
            en="Back to Production Plans List"
            pt="Voltar à Lista de Planos de Produção"
          />
        </a>
        <AddEditProductionPlan {...props} />
      </div>
    </>
  );
}
