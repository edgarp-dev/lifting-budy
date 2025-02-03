import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Navbar from "../../../../(_components)/Navbar.tsx";
import SuccessMessage from "../../../../(_components)/SuccessMessage.tsx";
import FormButtonWithLoader from "../../../../(_islands)/FormButtonWithLoader.tsx";
import BackButton from "../../../../../(_islands)/BackButton.tsx";
import { post } from "../../../../../../api/ApiClient.ts";

interface Props {
  success: boolean;
  routineId?: string;
  exerciseId?: string;
  error?: string;
}

export const handler: Handlers<Props> = {
  GET(_req: Request, ctx: FreshContext) {
    const { routineId, exerciseId } = ctx.params;

    return ctx.render({ success: false, routineId, exerciseId });
  },
  async POST(req: Request, ctx: FreshContext) {
    const { routineId, exerciseId } = ctx.params;

    try {
      const formData = await req.formData();
      const repetitions = formData.get("repetitions") as string;
      const weight = formData.get("weight") as string;
      const weightMeasure = "kg";

      if (!repetitions?.trim() || !weight?.trim()) {
        return ctx.render({
          success: false,
          error: "Repetitions and weight are required",
          routineId,
          exerciseId,
        });
      }

      const baseUrl = Deno.env.get("BASE_URL");
      const newRoutineExerciseUrl =
        `${baseUrl}/routines/${routineId}/exercises/${exerciseId}/routine-exercises`;
      const response = await post<{ routineExerciseId: number }>(
        newRoutineExerciseUrl,
        req.headers,
        {
          repetitions,
          weight,
          weightMeasure,
        },
      );

      if (!response?.routineExerciseId) {
        return ctx.render({
          success: false,
          error: "Failed to save routine exercise",
          routineId,
          exerciseId,
        });
      }

      return ctx.render({ success: true, routineId, exerciseId });
    } catch (error) {
      console.error(error);
      return ctx.render({
        success: false,
        error: (error as Error).message,
        routineId,
        exerciseId,
      });
    }
  },
};

export default function NewRoutineExercise({ data }: PageProps<Props>) {
  const { success, routineId, exerciseId, error } = data || { success: false };
  return (
    <div class="h-screen">
      <Navbar title="Create routine exercise" />
      <div class="m-2">
        <BackButton
          href={`/routines/${routineId}/exercises/${exerciseId}`}
          label="Back to routines"
        />
      </div>
      <div class="flex items-center justify-center p-4">
        <div class="rounded border border-gray-300 p-8 w-full max-w-md">
          {!success
            ? (
              <form
                id="new-routine-exercise-form"
                method="post"
                class="space-y-4"
              >
                <div>
                  <label
                    htmlFor="repetitions"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reps
                  </label>
                  <input
                    id="repetitions"
                    name="repetitions"
                    type="number"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter number of repetitions"
                  />
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Weight
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter weight in kg"
                  />
                </div>
                {error && <p class="text-red-500 text-sm mt-2">{error}</p>}
                <FormButtonWithLoader
                  text="Save"
                  formId="new-routine-exercise-form"
                  showLoader={!success}
                />
              </form>
            )
            : (
              <SuccessMessage
                message="New routine exercise saved successfully!"
                destinationUrl={`/routines/${routineId}/exercises/${exerciseId}`}
              />
            )}
        </div>
      </div>
    </div>
  );
}
