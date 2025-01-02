import { Handlers, FreshContext, PageProps } from "$fresh/server.ts";
import { post } from "../../api/ApiClient.ts";
import { getUserId } from "../../auth/SessionManager.ts";
import OkButton from "./(_islands)/OkButton.tsx";

interface Props {
	success: boolean;
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

			const newRoutinePostUrl = `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${userId}`;
			const response = await post<NewRoutineResponse>(
				newRoutinePostUrl,
				req.headers,
				{
					description: routineName,
					isCompleted,
				}
			);

			if (!response?.routineId) {
				return ctx.render({ success: false });
			}

			return ctx.render({ success: true });
		} catch (error) {
			console.error(error);

			return ctx.render({ success: false });
		}
	},
};

export default function NewRoutine(props: PageProps<Props>) {
	const success = props.data?.success;

	return (
		<>
			<nav class="sticky top-0 z-50 bg-gray-800">
				<div class="mx-auto">
					<div class="relative flex h-16 items-center justify-between">
						<div class="flex flex-1">
							<div>
								<div class="flex space-x-4">
									<p class="px-3 py-2 text-sm font-medium text-white">
										Add new routine
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<div class="min-h-screen bg-gray-100 flex items-center justify-center">
				<div class="bg-white shadow rounded p-6 w-full max-w-md">
					{!success ? (
						<form method="post">
							<div class="mb-4">
								<label
									for="routine_name"
									class="block text-sm font-medium text-gray-700"
								>
									Name
								</label>
								<input
									type="text"
									id="routine_name"
									name="routine_name"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							</div>
							<button
								type="submit"
								class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
							>
								Save
							</button>
						</form>
					) : (
						<div class="text-center">
							<p class="text-green-600 font-semibold mb-4">
								Routine created successfully
							</p>
							<OkButton destinationUrl="/routines" />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
