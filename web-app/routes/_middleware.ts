import { FreshContext } from "$fresh/server.ts";
import { requireAuth } from "../auth/authMiddleware.ts";
import { protectedRoutes } from "../routesConfig/index.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const isProtected = protectedRoutes.some((pattern) =>
    typeof pattern === "string" ? pattern === pathname : pattern.test(pathname)
  );

  if (isProtected) {
    const authReponse = await requireAuth(req);

    if (authReponse) {
      return authReponse;
    }
  }

  return ctx.next();
}
