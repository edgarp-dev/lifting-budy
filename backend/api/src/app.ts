import "jsr:@std/dotenv/load";
import { Application, Router } from "https://deno.land/x/oak@v17.1.1/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = <string> Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = <string> Deno.env.get("SUPABASE_ANON_KEY");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const router = new Router();

router.get("/hello", (context) => {
  context.response.body = "Hello world!";
});

router.post("/singup", async (context) => {
  try {
    const { email, password } = await context.request.body.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };
    } else {
      context.response.status = 201;
      context.response.body = { user: data.user };
    }
  } catch (error) {
    console.log((error as Error).message);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.post("/login", async (context) => {
  try {
    const { email, password } = await context.request.body.json();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };
    } else {
      context.response.status = 200;
      context.response.body = { session: data.session };
    }
  } catch (error) {
    console.log((error as Error).message);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.get("/user", async (context) => {
  const authToken = context.request.headers.get("Authorization");

  if (!authToken) {
    context.response.status = 401;
    context.response.body = { error: "Missing Authorization header" };
    return;
  }

  const { data, error } = await supabase.auth.getUser(authToken);

  if (error) {
    context.response.status = 401;
    context.response.body = { error: error.message };
  } else {
    context.response.status = 200;
    context.response.body = { user: data.user };
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
