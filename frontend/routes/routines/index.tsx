import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { get } from "../../api/ApiClient.ts";
import AddRoutineButton from "./(_islands)/AddRoutineButton.tsx";

type Routine = {
	routine_id: number;
	user_id: number;
	date: string;
	description: string;
	is_completed: boolean;
};

interface Props {
	routines: Routine[];
	message?: string;
}

export const handler: Handlers<Props> = {
	async GET(req: Request, ctx: FreshContext) {
		try {
			const routinesUrl =
				"https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/1";
			const routines = await get<Routine[]>(routinesUrl, req.headers);

			if (!routines || routines.length === 0) {
				return ctx.renderNotFound({
					message: "No routines",
				});
			}

			return ctx.render({ routines });
		} catch (error) {
			console.error(error);

			return ctx.renderNotFound({
				message: "Error retrieving routines",
			});
		}
	},
};

export default function RoutesPage(props: PageProps<Props>) {
	const { routines, message } = props.data;

	if (message) {
		return <p>{message}</p>;
	}

	return (
		<>
			<div>
				<nav class="sticky top-0 z-50 bg-gray-800">
					<div class="mx-auto">
						<div class="relative flex h-16 items-center justify-between">
							<div class="flex flex-1">
								<div>
									<div class="flex space-x-4">
										<p class="px-3 py-2 text-sm font-medium text-white">
											Routines
										</p>
									</div>
								</div>
							</div>
							<div>
								<AddRoutineButton />
							</div>
						</div>
					</div>
				</nav>
				<ul role="list" class="divide-y divide-gray-100 mx-5">
					{routines.map(({ description, date, is_completed }) => (
						<li class="flex justify-between gap-x-6 py-5">
							<div class="min-w-0 flex-auto">
								<p class="text-sm/6 font-semibold text-gray-900">
									{description}
								</p>
								<p class="mt-1 text-xs/5 text-gray-500">
									<time datetime="2023-01-23T13:23Z">{date}</time>
								</p>
								<p class="mt-1 text-xs/5 text-gray-500">
									{is_completed ? "Completed" : "In Progress"}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
