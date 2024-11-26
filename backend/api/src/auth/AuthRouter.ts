import { Router } from "https://deno.land/x/oak@v17.1.1/mod.ts";
import { login, signup } from "./AuthController.ts";

const router = new Router();

router.post("/login", login);
router.post("/singup", signup);

export default router;
