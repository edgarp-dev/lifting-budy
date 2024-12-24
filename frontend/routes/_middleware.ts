import { FreshContext } from "$fresh/server.ts";
import { requireAuth } from "../auth/authMiddleware.ts";
import { protectedRuotes } from "./routes.ts";

export async function handler(req: Request, ctx: FreshContext) {
    const url = new URL(req.url);
    if (protectedRuotes.includes(url.pathname)) {
        const authReponse = await requireAuth(req);

        if (authReponse) {
            return authReponse;
        }
    }

    return ctx.next();
}