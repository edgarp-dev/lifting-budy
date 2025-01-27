import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { post } from "../../../../api/ApiClient.ts";
import RedirectButton from "../../(_islands)/RedirectButton.tsx";
import FormButtonWithLoader from "../../(_islands)/FormButtonWithLoader.tsx";

interface Props {
	success: boolean;
	routineId?: string;
}

type NewExcersiceResponse = {
	exerciseId: number;
};

export const handler: Handlers<Props> = {
	async POST(req: Request, ctx: FreshContext) {
		try {
			const formData = await req.formData();
			const name = formData.get("name") as string;
			const muscle = formData.get("muscle") as string;
			const routineId = ctx.params.routineId;

			const newExercisePostUrl = `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${routineId}/exercises`;
			const response = await post<NewExcersiceResponse>(
				newExercisePostUrl,
				req.headers,
				{
					name,
					muscle,
				}
			);

			if (!response?.exerciseId) {
				return ctx.render({ success: false });
			}

			return ctx.render({ success: true, routineId });
		} catch (error) {
			console.error(error);

			return ctx.render({ success: false });
		}
	},
};

export default function RoutineExerciseCreate({ data }: PageProps<Props>) {
	const { success, routineId } = data || { success: false };

	return (
		<>
			<nav class="sticky top-0 z-50 bg-gray-800">
				<div class="mx-auto">
					<div class="relative flex h-16 items-center justify-between">
						<div class="flex flex-1">
							<div>
								<div class="flex space-x-4">
									<p class="px-3 py-2 text-sm font-medium text-white">
										Create exercise
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
									htmlFor="name"
									class="block text-sm font-medium text-gray-700"
								>
									Name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="muscle"
									class="block text-sm font-medium text-gray-700"
								>
									Muscle
								</label>
								<input
									id="muscle"
									name="muscle"
									type="text"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>
							<FormButtonWithLoader text="Save" formId="new-exercise-form" showLoader={!success} />
						</form>
					) : (
						<div class="text-center">
							<h1 class="text-2xl font-bold text-green-600 mb-4">
								New excersice saved successfully
							</h1>
							<RedirectButton
								text="Ok"
								destinationUrl={`/routines/${routineId}`}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
