import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import MaterialsTree from "../../../islands/MaterialsTree.tsx";

export default function ProductDetail(props: PageProps) {
  return (
    <>
      <Head>
        <title>Material's Tree</title>
      </Head>
      <div class="max-w-screen-md m-auto p-4">
        <MaterialsTree {...props} />
      </div>
    </>
  );
}
