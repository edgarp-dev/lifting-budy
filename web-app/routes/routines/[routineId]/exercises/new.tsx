import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { post } from "../../../../api/ApiClient.ts";
import FormButtonWithLoader from "../../(_islands)/FormButtonWithLoader.tsx";
import Navbar from "../../(_components)/Navbar.tsx";
import BackButton from "../../../(_islands)/BackButton.tsx";
import SuccessMessage from "../../(_components)/SuccessMessage.tsx";

interface Props {
  success: boolean;
  routineId?: string;
  error?: string;
}

type NewExcersiceResponse = {
  exerciseId: number;
};

export const handler: Handlers<Props> = {
  GET(_req: Request, ctx: FreshContext) {
    const { routineId } = ctx.params;

    return ctx.render({ success: false, routineId });
  },
  async POST(req: Request, ctx: FreshContext) {
    const { routineId } = ctx.params;
    try {
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const muscle = formData.get("muscle") as string;

      if (!name?.trim() || !muscle?.trim()) {
        return ctx.render({
          success: false,
          error: "Name and muscle are required",
          routineId,
        });
      }

      const baseUrl = Deno.env.get("BASE_URL");
      const newExercisePostUrl = `${baseUrl}/routines/${routineId}/exercises`;
      const response = await post<NewExcersiceResponse>(
        newExercisePostUrl,
        req.headers,
        {
          name,
          muscle,
        },
      );

      if (!response?.exerciseId) {
        return ctx.render({
          success: false,
          error: "Failed to save exercise",
          routineId,
        });
      }

      return ctx.render({ success: true, routineId });
    } catch (error) {
      console.error(error);

      return ctx.render({
        success: false,
        error: (error as Error).message,
        routineId,
      });
    }
  },
};

export default function RoutineExerciseCreate({ data }: PageProps<Props>) {
  const { success, routineId, error } = data || { success: false };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Create exercise" />
      <div class="m-2">
        <BackButton href={`/routines/${routineId}`} label="Back to routine" />
      </div>
      <div class="flex items-center justify-center p-4">
        <div class="rounded border border-gray-300 p-8 w-full max-w-md">
          {!success
            ? (
              <form id="new-exercise-form" method="post">
                <div>
                  <label
                    htmlFor="name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter exercise name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="muscle"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Muscle
                  </label>
                  <input
                    id="muscle"
                    name="muscle"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter exercise muscle"
                  />
                </div>
                {error && <p class="text-red-500 text-sm mt-2">{error}</p>}
                <div class="mt-6">
                  <FormButtonWithLoader
                    text="Save"
                    formId="new-exercise-form"
                    showLoader={!success}
                  />
                </div>
              </form>
            )
            : (
              <SuccessMessage
                message="New excersice saved successfully!"
                destinationUrl={`/routines/${routineId}`}
              />
            )}
        </div>
      </div>
    </div>
  );
}
