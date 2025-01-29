import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import BackButton from "../(_islands)/BackButton.tsx"; // Asegúrate de que la ruta sea correcta
import { post } from "../../api/ApiClient.ts";
import { getUserId } from "../../auth/SessionManager.ts";
import Navbar from "./(_components)/Navbar.tsx";
import OkButton from "./(_islands)/OkButton.tsx";

interface Props {
  success: boolean;
  error?: string; // Para manejar mensajes de error
}

type NewRoutineResponse = {
  routineId: number;
};

export const handler: Handlers<Props> = {
  async POST(req: Request, ctx: FreshContext) {
    try {
      const userId = getUserId(req.headers);
      const formData = await req.formData();
      const routineName = formData.get("routine_name") as string;
      const isCompleted = false;

      if (!routineName?.trim()) {
        return ctx.render({
          success: false,
          error: "Routine name is required",
        });
      }

      const newRoutinePostUrl =
        `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${userId}`;
      const response = await post<NewRoutineResponse>(
        newRoutinePostUrl,
        req.headers,
        {
          description: routineName,
          isCompleted,
        },
      );

      if (!response?.routineId) {
        return ctx.render({
          success: false,
          error: "Failed to create routine",
        });
      }

      return ctx.render({ success: true });
    } catch (error) {
      console.error(error);
      return ctx.render({
        success: false,
        error: "An unexpected error occurred",
      });
    }
  },
};

export default function NewRoutine(props: PageProps<Props>) {
  const { success, error } = props.data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Add New Routine" />
      <div class="m-2">
        <BackButton href="/routines" label="Back to Routines" />
      </div>
      <div class="flex items-center justify-center p-4">
        <div class="rounded border border-gray-300 p-8 w-full max-w-md">
          {!success
            ? (
              <form method="post">
                <div class="mb-6">
                  <label
                    for="routine_name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Routine Name
                  </label>
                  <input
                    type="text"
                    id="routine_name"
                    name="routine_name"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter routine name"
                  />
                  {error && <p class="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  class="w-full bg-slate-800 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-all"
                >
                  Save
                </button>
              </form>
            )
            : (
              <div class="text-center">
                <svg
                  class="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  >
                  </path>
                </svg>
                <p class="mt-4 text-lg font-semibold text-gray-800">
                  Routine created successfully!
                </p>
                <div class="mt-6">
                  <OkButton destinationUrl="/routines" />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
