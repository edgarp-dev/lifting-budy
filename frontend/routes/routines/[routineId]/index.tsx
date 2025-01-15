import { Handlers, PageProps } from "$fresh/server.ts";
import { get } from "../../../api/ApiClient.ts";
import { getSessionToken, getUserId } from "../../../auth/SessionManager.ts";
import RedirectButton from "../(_islands)/RedirectButton.tsx";
import ToggleIsCompleted from "../(_islands)/ToggleIsCompleted.tsx";

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

		const routineDetailsUrl = `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${routineId}/details`;

		const routineDetails = await get<RoutineDetails>(
			routineDetailsUrl,
			req.headers
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
		<>
			<nav class="sticky top-0 z-50 bg-gray-800">
				<div class="mx-auto">
					<div class="relative flex h-16 items-center justify-between">
						<div class="flex flex-1">
							<div>
								<div class="flex space-x-4">
									<p class="px-3 py-2 text-sm font-medium text-white">
										{description}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<div class="min-h-screen flex bg-gray-100">
				<div class="container mx-auto p-4">
					<ToggleIsCompleted
						isCompleted={isCompleted}
						routineId={routineId}
						userId={userId}
						sessionToken={sessionToken}
					/>
					<RedirectButton
						text="Add excersise"
						destinationUrl={`/routines/${routineId}/exercises/new`}
					/>
					<ul role="list" class="divide-y divide-gray-200">
						{exercises?.map(({ exercise_id, name, muscle }) => (
							<li
								key={exercise_id}
								class="py-4 flex items-center justify-between"
							>
								<a
									href={`/routines/${routineId}/exercises/${exercise_id}`}
									class="flex flex-col min-w-0 flex-auto text-gray-900 hover:text-blue-600"
								>
									<p class="text-sm font-semibold">{name}</p>
									<p class="mt-1 text-xs text-gray-500">{muscle}</p>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
