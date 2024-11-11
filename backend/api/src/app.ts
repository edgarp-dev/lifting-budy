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

router.post("/routines/:userId", async (context) => {
  try {
    // const isValidAuthToken = await validateAuthToken(context);

    // if (!isValidAuthToken) {
    //   context.response.status = 401;
    //   context.response.body = { error: "Invalid or expired token" };

    //   return;
    // }

    const { userId } = context.params;
    const { description, isCompleted } = await context.request.body
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
      const routineId = data[0].routine_id;
      context.response.body = { routineId: routineId };

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
    // const isValidAuthToken = await validateAuthToken(context);

    // if (!isValidAuthToken) {
    //   context.response.status = 401;
    //   context.response.body = { error: "Invalid or expired token" };

    //   return;
    // }

    const userId = context.params.userId;

    if (!userId) {
      context.response.status = 400;
      context.response.body = { error: "Missing userId parameter" };

      return;
    }

    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };

      return;
    } else {
      context.response.status = 200;
      context.response.body = data;

      return;
    }
  } catch (error) {
    console.error(error);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.put("/routines/:userId/:routineId", async (context) => {
  // const isValidAuthToken = await validateAuthToken(context);

  // if (!isValidAuthToken) {
  //   context.response.status = 401;
  //   context.response.body = { error: "Invalid or expired token" };

  //   return;
  // }

  const { routineId, userId } = context.params;
  const { isCompleted } = await context.request.body.json();

  const { data, error } = await supabase.from("routines")
    .update({
      is_completed: isCompleted,
    })
    .eq("routine_id", routineId)
    .eq("user_id", userId)
    .select("routine_id");

  if (error) {
    context.response.status = 400;
    context.response.body = { error: error.message };
    return;
  }

  const updatedRoutineId = data[0].routine_id;
  if (!updatedRoutineId) {
    context.response.status = 404;
    context.response.body = { error: "Routine not found" };

    return;
  } else {
    context.response.status = 200;
    context.response.body = { id: updatedRoutineId };

    return;
  }
});

router.delete("/routines/:userId/:id", async (context) => {
  try {
    // const isValidAuthToken = await validateAuthToken(context);

    // if (!isValidAuthToken) {
    //   context.response.status = 401;
    //   context.response.body = { error: "Invalid or expired token" };

    //   return;
    // }

    const userId = context.params.userId;
    const routineId = context.params.id;

    const { data: userRoutines, error: errorUserRoutines } = await supabase
      .from("routines").select("routine_id").eq("user_id", userId);

    if (errorUserRoutines) {
      context.response.status = 400;
      context.response.body = { error: errorUserRoutines.message };
      return;
    }

    if (userRoutines.length === 0) {
      context.response.status = 404;
      context.response.body = { error: "Routine not found" };

      return;
    }

    const { data: exercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("exercise_id")
      .eq("routine_id", routineId);

    if (exercisesError) {
      context.response.status = 400;
      context.response.body = { error: exercisesError.message };
      return;
    }

    if (exercises.length > 0) {
      const exerciseIds = exercises.map((exercise) => exercise.exercise_id);

      const { error: deleteRoutineExercisesError } = await supabase
        .from("routineexercises")
        .delete()
        .in("exercise_id", exerciseIds);

      if (deleteRoutineExercisesError) {
        context.response.status = 400;
        context.response.body = { error: deleteRoutineExercisesError.message };
        return;
      }

      const { error: deleteExercisesError } = await supabase
        .from("exercises")
        .delete()
        .eq("routine_id", routineId);

      if (deleteExercisesError) {
        context.response.status = 400;
        context.response.body = { error: deleteExercisesError.message };
        return;
      }
    }

    const { data: deletedRoutine, error: deleteRoutineError } = await supabase
      .from("routines")
      .delete()
      .eq("routine_id", routineId)
      .select("routine_id");

    if (deleteRoutineError) {
      context.response.status = 400;
      context.response.body = { error: deleteRoutineError.message };
      return;
    }

    if (!deletedRoutine) {
      context.response.status = 404;
      context.response.body = { error: "Routine not found" };
    } else {
      context.response.status = 200;
      context.response.body = {
        id: routineId,
      };
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/routines/:routineId/exercises", async (context) => {
  try {
    // const isValidAuthToken = await validateAuthToken(context);

    // if (!isValidAuthToken) {
    //   context.response.status = 401;
    //   context.response.body = { error: "Invalid or expired token" };

    //   return;
    // }

    const routineId = context.params.routineId;
    const { name, muscle } = await context.request.body.json();

    const { data, error } = await supabase.from("exercises").insert({
      routine_id: routineId,
      name: name,
      muscle: muscle,
    }).select("exercise_id");

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };
    } else {
      context.response.status = 201;

      const exerciseId = data[0].exercise_id;
      context.response.body = { exerciseId: exerciseId };
    }
  } catch (error) {
    console.error(error);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.get("/routines/:routineId/exercises", async (context) => {
  try {
    // const isValidAuthToken = await validateAuthToken(context);

    // if (!isValidAuthToken) {
    //   context.response.status = 401;
    //   context.response.body = { error: "Invalid or expired token" };

    //   return;
    // }

    const { routineId } = context.params;

    const { data, error } = await supabase
      .from("exercises")
      .select(`
      exercise_id,
      name,
      muscle
    `)
      .eq("routine_id", routineId);

    if (error) {
      context.response.status = 400;
      context.response.body = { error: error.message };

      return;
    } else {
      context.response.status = 200;
      context.response.body = data;

      return;
    }
  } catch (error) {
    console.error(error);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.post(
  "/routines/:routineId/exercises/:exerciseId/routine-exercises",
  async (context) => {
    try {
      // const isValidAuthToken = await validateAuthToken(context);

      // if (!isValidAuthToken) {
      //   context.response.status = 401;
      //   context.response.body = { error: "Invalid or expired token" };

      //   return;
      // }

      const { exerciseId } = context.params;
      const { repetitions, weight, weightMeasure } = await context.request.body
        .json();

      const { data, error } = await supabase.from("routineexercises").insert({
        exercise_id: exerciseId,
        repetitions: repetitions,
        weight: weight,
        weight_measure: weightMeasure,
      }).select("routine_exercise_id");

      if (error) {
        context.response.status = 400;
        context.response.body = { error: error.message };

        return;
      } else {
        context.response.status = 201;

        const routineExerciseId = data[0].routine_exercise_id;
        context.response.body = { routineExerciseId: routineExerciseId };

        return;
      }
    } catch (error) {
      console.error(error);

      context.response.status = 500;
      context.response.body = { error: "Internal Server Error" };
    }
  },
);

router.get(
  "/routines/:routineId/exercises/:exerciseId/routine-exercises/:id",
  async (context) => {
    try {
      // const isValidAuthToken = await validateAuthToken(context);

      // if (!isValidAuthToken) {
      //   context.response.status = 401;
      //   context.response.body = { error: "Invalid or expired token" };

      //   return;
      // }

      const { exerciseId, id } = context.params;

      const { data, error } = await supabase.from("routineexercises")
        .select(`
          repetitions,
          weight,
          weight_measure
          `)
        .eq("routine_exercise_id", id)
        .eq("exercise_id", exerciseId);

      if (error) {
        context.response.status = 400;
        context.response.body = { error: error.message };

        return;
      } else {
        context.response.status = 200;
        context.response.body = data;

        return;
      }
    } catch (error) {
      console.error(error);

      context.response.status = 500;
      context.response.body = { error: "Internal Server Error" };
    }
  },
);

router.post("/chat/message", async (context) => {
  try {
    // const isValidAuthToken = await validateAuthToken(context);

    // if (!isValidAuthToken) {
    //   context.response.status = 401;
    //   context.response.body = { error: "Invalid or expired token" };

    //   return;
    // }

    const { question, userId } = await context.request.body.json();

    const chatResponse = await askGemini(question);

    context.response.status = 200;
    context.response.body = chatResponse;
  } catch (error) {
    console.error(error);

    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

async function askGemini(question: string): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  const geminiEndpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  const response = await fetch(geminiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: question,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  return data.candidates?.[0]?.content.parts[0].text ||
    "No response from Gemini";
}

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
