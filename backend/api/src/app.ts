import "jsr:@std/dotenv/load";
import { Application, Router } from "https://deno.land/x/oak@v17.1.1/mod.ts";
import authRouter from "./auth/AuthRouter.ts";
import routinesController from "./routines/RoutinesRouter.ts";

const router = new Router();

router.get("/hello", (context) => {
  context.response.body = "Hello world!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

app.use(routinesController.routes());
app.use(routinesController.allowedMethods());

const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
