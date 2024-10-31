import "jsr:@std/dotenv/load";
import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v17.1.1/mod.ts";
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
    const { email, password, name } = await context.request.body.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };

      return;
    }

    const user = data.user;

    const { error: insertError } = await supabase.from(
      "users",
    ).insert({
      email: user?.email,
      name: name,
      auth_id: user?.id,
    });

    if (insertError) {
      context.response.status = 400;
      context.response.body = { error: insertError.message };

      return;
    }

    context.response.status = 201;
    context.response.body = { user };
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

router.post("/routine", async (context) => {
  try {
    const isValidAuthToken = await validateAuthToken(context);

    if (!isValidAuthToken) {
      context.response.status = 401;
      context.response.body = { error: "Invalid or expired token" };

      return;
    }

    const { userId, description, isCompleted } = await context.request.body
      .json();

    const { data, error } = await supabase.from("routines").insert({
      user_id: userId,
      date: new Date().toISOString(),
      description: description,
      is_completed: isCompleted ?? false,
    }).select("routine_id");

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };

      return;
    } else {
      context.response.status = 201;
      context.response.body = { routineId: data[0].routine_id };

      return;
    }
  } catch (error) {
    console.error(error);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.get("/routines/:userId", async (context) => {
  try {
    const isValidAuthToken = await validateAuthToken(context);

    if (!isValidAuthToken) {
      context.response.status = 401;
      context.response.body = { error: "Invalid or expired token" };

      return;
    }

    const userId = context.params.userId;

    if (!userId) {
      context.response.status = 400;
      context.response.body = { error: "Missing userId parameter" };

      return;
    }

    // Fetch all routines for the specified userId
    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("user_id", userId);

    // Handle any errors during query
    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };
    } else {
      context.response.status = 200;
      context.response.body = data; // Respond with the user's routines
    }
  } catch (error) {
    console.error(error);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

const validateAuthToken = async (context: Context): Promise<boolean> => {
  let isAuthTokenValid = true;
  try {
    const authHeader = context.request.headers.get("Authorization");

    if (!authHeader) {
      isAuthTokenValid = false;
    } else {
      const authToken = authHeader.split(" ")[1];

      const { error } = await supabase.auth.getUser(authToken);

      if (error) isAuthTokenValid = false;
    }
  } catch (error) {
    console.error(error);

    isAuthTokenValid = false;
  }

  return isAuthTokenValid;
};

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
