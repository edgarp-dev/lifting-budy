import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import RedirectButton from "../../../(_islands)/RedirectButton.tsx";
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

		const exerciseDetailsUrl = `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${routineId}/exercises/${exerciseId}/details`;
		const response = await get<ExerciseDetails>(
			exerciseDetailsUrl,
			req.headers
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
		<>
			<nav class="sticky top-0 z-50 bg-gray-800">
				<div class="mx-auto">
					<div class="relative flex h-16 items-center justify-between">
						<div class="flex flex-1">
							<div>
								<div class="flex space-x-4">
									<p class="px-3 py-2 text-sm font-medium text-white">
										Routine Exercise Details
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<div class="min-h-screen flex bg-gray-100">
				<div class="container mx-auto p-4">
					<div class="flex flex-col items-start bg-white space-y-2">
						<p class="text-xl font-bold text-gray-800">{name}</p>
						<p class="text-sm font-medium text-gray-600">Muscle: {muscle}</p>
						<RedirectButton
							text="Add routine excersise"
							destinationUrl={`/routines/${routineId}/exercises/${exerciseId}/routine-exercises/new`}
						/>
					</div>
					<ul role="list" class="divide-y divide-gray-200">
						{routineExercises?.map(
							({
								routine_exercise_id,
								repetitions,
								weight,
								weight_measure,
							}) => (
								<li
									key={routine_exercise_id}
									class="py-4 flex flex-auto flex-col justify-between"
								>
									<p class="text-sm font-semibold">{repetitions} reps</p>
									<p class="mt-1 text-xs text-gray-500">{`${weight} ${weight_measure}`}</p>
								</li>
							)
						)}
					</ul>
				</div>
			</div>
		</>
	);
}
