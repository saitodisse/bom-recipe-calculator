// _middleware.ts
import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "jsr:@std/http/cookie";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  // Get mode from cookie in a safer way
  const cookies = getCookies(req.headers);
  const mode = cookies["mode"] || "light";

  // Continue with normal processing
  const resp = await ctx.next();

  // Add a custom header to indicate the mode
  const newHeaders = new Headers(resp.headers);
  newHeaders.set("X-Color-Mode", mode);

  // Return the response with the additional header
  return new Response(resp.body, {
    status: resp.status,
    headers: newHeaders,
  });
}
