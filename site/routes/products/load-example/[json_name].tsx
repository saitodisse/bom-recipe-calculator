import { Handlers, PageProps } from "$fresh/server.ts";
import { type IProduct } from "@bom-recipe-calculator";
import ExampleLoader from "../../../islands/ExampleLoader.tsx";

type LocalProps = {
  products: IProduct[];
};

export const handler: Handlers<LocalProps> = {
  // Load example products from JSON file and return to renderedPage
  async GET(_req, _ctx) {
    const jsonName: string = _ctx.params.json_name;
    // Load JSON file from /data folder
    const jsonPath = `./data/${jsonName}.json`;
    const json = Deno.readTextFileSync(jsonPath);
    const products = JSON.parse(json);

    return _ctx.render({ products: products["products"] });
  },
};

export default function ExampleLoaderPage(
  { data }: PageProps<
    LocalProps
  >,
) {
  return <ExampleLoader products={data.products} />;
}
