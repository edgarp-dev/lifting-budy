import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Navbar from "../../../(_components)/Navbar.tsx";
import RedirectButton from "../../../(_islands)/RedirectButton.tsx";
import BackButton from "../../../../(_islands)/BackButton.tsx";
import BorderTable from "../../../../(_islands)/BoderTable.tsx";
import BorderTableItem from "../../../../(_islands)/BorderTableItem.tsx";
import { get } from "../../../../../api/ApiClient.ts";

type RoutineExercises = {
  routine_exercise_id: number;
  repetitions: number;
  weight: string;
  weight_measure: string;
};

type ExerciseDetails = {
  name: string;
  muscle: string;
  routineExercises: RoutineExercises[];
};

type Props = {
  routineId?: string;
  exerciseId?: string;
  message?: string;
  exerciseDetails?: ExerciseDetails;
};

export const handler: Handlers<Props> = {
  async GET(req: Request, ctx: FreshContext) {
    const { routineId, exerciseId } = ctx.params;

    const baseUrl = Deno.env.get("BASE_URL");
    const exerciseDetailsUrl =
      `${baseUrl}/routines/${routineId}/exercises/${exerciseId}/details`;
    const response = await get<ExerciseDetails>(
      exerciseDetailsUrl,
      req.headers,
    );

    if (!response) {
      return ctx.render({ message: "Exercise details not found" });
    }

    const { name, muscle, routineExercises } = response;

    return ctx.render({
      routineId,
      exerciseId,
      exerciseDetails: {
        name,
        muscle,
        routineExercises,
      },
    });
  },
};

export default function ExeciseDetails(props: PageProps<Props>) {
  const { routineId, exerciseId, message, exerciseDetails } = props.data;

  if (message || !exerciseDetails) {
    return (
      <div class="min-h-screen flex bg-gray-100">
        <div class="w-full items-center justify-center text-center">
          <p class="text-xl font-semibold text-gray-500">{message}</p>
        </div>
      </div>
    );
  }

  const { name, muscle, routineExercises } = exerciseDetails;

  return (
    <div class="h-screen">
      <Navbar title="Excersice details" />
      <div class="m-2">
        <BackButton
          href={`/routines/${routineId}`}
          label="Back to routine details"
        />
      </div>
      <div class="flex bg-gray-100">
        <div class="container mx-auto p-4">
          <div class="flex flex-row items-center justify-between rounded border border-gray-300 p-8 mx-6">
            <div class="flex flex-col">
              <p class="text-xl font-bold text-gray-800">{name}</p>
              <p class="text-sm font-medium text-gray-600">Muscle: {muscle}</p>
            </div>
            <RedirectButton
              text="Add routine excersise"
              destinationUrl={`/routines/${routineId}/exercises/${exerciseId}/routine-exercises/new`}
            />
          </div>
          <div class="mt-4 max-h-[400px] overflow-y-auto">
            <BorderTable>
              {routineExercises?.map(
                ({
                  routine_exercise_id,
                  repetitions,
                  weight,
                  weight_measure,
                }) => (
                  <BorderTableItem
                    key={routine_exercise_id}
                    isClickable={false}
                  >
                    <p class="text-lg font-semibold text-gray-900">
                      {repetitions} reps
                    </p>
                    <p class="text-sm text-gray-500 mt-1">
                      {`${weight} ${weight_measure}`}
                    </p>
                  </BorderTableItem>
                ),
              )}
            </BorderTable>
          </div>
        </div>
      </div>
    </div>
  );
}
