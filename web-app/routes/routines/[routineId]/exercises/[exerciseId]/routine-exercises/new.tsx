import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import FormButtonWithLoader from "../../../../(_islands)/FormButtonWithLoader.tsx";
import RedirectButton from "../../../../(_islands)/RedirectButton.tsx";
import { post } from "../../../../../../api/ApiClient.ts";

interface Props {
	success: boolean;
	routineId?: string;
	exerciseId?: string;
}

export const handler: Handlers<Props> = {
	async POST(req: Request, ctx: FreshContext) {
		try {
			const formData = await req.formData();
			const repetitions = formData.get("repetitions") as string;
			const weight = formData.get("weight") as string;
			const weightMeasure = "kg";

			const { routineId, exerciseId } = ctx.params;

			const newRoutineExerciseUrl = `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${routineId}/exercises/${exerciseId}/routine-exercises`;
			const response = await post<{ routineExerciseId: number }>(
				newRoutineExerciseUrl,
				req.headers,
				{
					repetitions,
					weight,
					weightMeasure,
				}
			);

			if (!response?.routineExerciseId) {
				return ctx.render({ success: false });
			}

			return ctx.render({ success: true, routineId, exerciseId });
		} catch (error) {
			console.error(error);
			return ctx.render({ success: false });
		}
	},
};

export default function NewRoutineExercise({ data }: PageProps<Props>) {
	const { success, routineId, exerciseId } = data || { success: false };
	return (
		<>
			<nav class="sticky top-0 z-50 bg-gray-800">
				<div class="mx-auto">
					<div class="relative flex h-16 items-center justify-between">
						<div class="flex flex-1">
							<div>
								<div class="flex space-x-4">
									<p class="px-3 py-2 text-sm font-medium text-white">
										Create routine exercise
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<div class="min-h-screen bg-gray-100 flex items-center justify-center">
				<div class="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
					{!success ? (
						<form id="new-exercise-form" method="post" class="space-y-4">
							<div>
								<label
									htmlFor="repetitions"
									class="block text-sm font-medium text-gray-700"
								>
									Reps
								</label>
								<input
									id="repetitions"
									name="repetitions"
									type="number"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="weight"
									class="block text-sm font-medium text-gray-700"
								>
									Weight
								</label>
								<input
									id="weight"
									name="weight"
									type="number"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>
							<FormButtonWithLoader
								text="Save"
								formId="new-exercise-form"
								showLoader={!success}
							/>
						</form>
					) : (
						<div class="text-center">
							<h1 class="text-2xl font-bold text-green-600 mb-4">
								New routine excersice saved successfully
							</h1>
							<RedirectButton
								text="Ok"
								destinationUrl={`/routines/${routineId}/exercises/${exerciseId}`}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
