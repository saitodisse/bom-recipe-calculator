import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import Lng from "../../islands/Lng.tsx";
import ProductionReports from "../../islands/ProductionReports.tsx";

export default function ProductionReportsPage(props: PageProps) {
  return (
    <>
      <Head>
        <title>Production Reports</title>
      </Head>
      <div className="max-w-screen-md m-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-foreground bg-background">
            <Lng
              en="Production Reports"
              pt="Relatórios de Produção"
            />
          </h1>
        </div>
        <ProductionReports {...props} />
      </div>
    </>
  );
}
