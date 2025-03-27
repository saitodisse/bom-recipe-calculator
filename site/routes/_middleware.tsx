// _middleware.ts
import { FreshContext } from "$fresh/server.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  const mode =
    req.headers.get("cookie")?.split("; ").find((row) =>
      row.startsWith("mode=")
    )?.split("=")[1] || "light";

  const resp = await ctx.next();

  if (mode === "dark") {
    const body = await resp.text();
    const newBody = body.replace("<html", '<html class="dark"');
    return new Response(newBody, {
      status: resp.status,
      headers: resp.headers,
    });
  }

  return resp;
}
