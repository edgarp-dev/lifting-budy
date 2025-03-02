import { Handlers, PageProps } from "$fresh/server.ts";
import { get } from "../../../api/ApiClient.ts";
import { getSessionToken, getUserId } from "../../../auth/SessionManager.ts";
import RedirectButton from "../(_islands)/RedirectButton.tsx";
import ToggleIsCompleted from "../(_islands)/ToggleIsCompleted.tsx";
import BackButton from "../../(_islands)/BackButton.tsx";
import Navbar from "../(_components)/Navbar.tsx";
import BorderTable from "../../(_islands)/BoderTable.tsx";
import BorderTableItem from "../../(_islands)/BorderTableItem.tsx";

type Exercise = {
  exercise_id: number;
  name: string;
  muscle: string;
};

type RoutineDetails = {
  description: string;
  isCompleted: boolean;
  exercises: Exercise[];
};

type RoutineInfo = {
  routineId: string;
  description: string;
  isCompleted: boolean;
  exercises: Exercise[];
  sessionToken: string;
  updateRoutineUrl: string;
};

interface Props {
  routineInfo?: RoutineInfo;
  message?: string;
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const { routineId } = ctx.params;

    const baseUrl = Deno.env.get("BASE_URL");
    const routineDetailsUrl = `${baseUrl}/routines/${routineId}/details`;

    const routineDetails = await get<RoutineDetails>(
      routineDetailsUrl,
      req.headers,
    );

    if (!routineDetails) {
      return ctx.render({ message: "Routine not found" });
    }

    const { description, isCompleted, exercises } = routineDetails;
    const sessionToken = getSessionToken(req.headers);
    const userId = getUserId(req.headers);
    const updateRoutineUrl = `${baseUrl}/routines/${userId}/${routineId}`;

    return ctx.render({
      routineInfo: {
        routineId,
        description,
        isCompleted,
        exercises,
        sessionToken,
        updateRoutineUrl,
      },
    });
  },
};

export default function RoutineDetails(props: PageProps<Props>) {
  const { message, routineInfo } = props.data;

  if (!routineInfo) {
    return (
      <div class="min-h-screen flex bg-gray-100">
        <div class="w-full items-center justify-center text-center">
          <p class="text-xl font-semibold text-gray-500">{message}</p>
        </div>
      </div>
    );
  }

  const {
    routineId,
    description,
    isCompleted,
    exercises,
    sessionToken,
    updateRoutineUrl,
  } = routineInfo;

  return (
    <div class="h-screen">
      <Navbar title={description} />
      <div class="m-2">
        <BackButton href="/routines" label="Back to routines" />
      </div>
      <div class="flex bg-gray-100">
        <div class="container mx-auto max-w-3xl">
          <div class="flex flex-col justify-between rounded border border-gray-300 p-8 mx-6">
            <div class="flex flex-col mb-4">
              <p class="text-lg font-semibold text-gray-900 mb-2">
                Is completed?
              </p>
              <ToggleIsCompleted
                isCompleted={isCompleted}
                sessionToken={sessionToken}
                updateRoutineUrl={updateRoutineUrl}
              />
            </div>
            <RedirectButton
              text="Add Exercise"
              destinationUrl={`/routines/${routineId}/exercises/new`}
            />
          </div>
          <div class="mt-4 flex-grow h-[calc(100vh-320px)] overflow-y-auto">
            <BorderTable>
              {exercises?.map(({ exercise_id, name, muscle }) => (
                <BorderTableItem key={exercise_id}>
                  <a
                    href={`/routines/${routineId}/exercises/${exercise_id}`}
                    class="flex flex-col min-w-0 flex-auto text-gray-900"
                  >
                    <p class="text-lg font-semibold text-gray-900">{name}</p>
                    <p class="text-sm text-gray-500 mt-1">{muscle}</p>
                  </a>
                </BorderTableItem>
              ))}
            </BorderTable>
          </div>
        </div>
      </div>
    </div>
  );
}
