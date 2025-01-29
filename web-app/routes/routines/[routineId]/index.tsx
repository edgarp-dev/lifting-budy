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
  userId: string;
  description: string;
  isCompleted: boolean;
  exercises: Exercise[];
  sessionToken: string;
};

interface Props {
  routineInfo?: RoutineInfo;
  message?: string;
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const { routineId } = ctx.params;

    const routineDetailsUrl =
      `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${routineId}/details`;

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

    return ctx.render({
      routineInfo: {
        routineId,
        userId,
        description,
        isCompleted,
        exercises,
        sessionToken,
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
    userId,
    description,
    isCompleted,
    exercises,
    sessionToken,
  } = routineInfo;

  return (
    <div>
      <Navbar title={description} />
      <div class="m-2">
        <BackButton href="/routines" label="Back to Routines" />
      </div>
      <div class="min-h-screen flex bg-gray-100">
        <div class="container mx-auto">
          <div class="flex flex-row items-center justify-between rounded border border-gray-300 p-8 mx-6">
            <ToggleIsCompleted
              isCompleted={isCompleted}
              routineId={routineId}
              userId={userId}
              sessionToken={sessionToken}
            />
            <RedirectButton
              text="Add Exercise"
              destinationUrl={`/routines/${routineId}/exercises/new`}
            />
          </div>
          <div class="mt-4 max-h-[400px] overflow-y-auto">
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
