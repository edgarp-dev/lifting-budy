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

type RoutineResponse = {
	currentPage: number;
	totalPages: number;
	totalResults: number;
	routines: Routine[];
};

interface Props {
	routines: Routine[];
	message?: string;
	nextPage?: number;
	currentPage: number;
	totalPages: number;
}

export const handler: Handlers<Props> = {
	async GET(req: Request, ctx: FreshContext) {
		try {
			const page = parseInt(ctx.url.searchParams.get("page") || "1");
			const pageSize = parseInt(ctx.url.searchParams.get("pageSize") || "10");

			const baseUrl = Deno.env.get("BASE_URL");
			const routinesUrl = `${baseUrl}/routines/1?page=${page}&pageSize=${pageSize}`;

			const response = await get<RoutineResponse>(routinesUrl, req.headers);

			if (!response) {
				return ctx.render({
					message: "No routines",
				});
			}

			const { routines, totalPages, totalResults } = response;

			const nextPage = routines.length === pageSize ? page + 1 : undefined;

			return ctx.render({
				routines,
				nextPage,
				currentPage: page,
				totalPages,
				totalResults,
			});
		} catch (error) {
			console.error(error);

			return ctx.render({
				message: "Error retrieving routines",
			});
		}
	},
};

export default function RoutesPage(props: PageProps<Props>) {
	const { routines, message, nextPage, currentPage, totalPages } = props.data;

	if (message) {
		return <p>{message}</p>;
	}

	const renderPaginationLinks = () => {
		const paginationLinks = [];
		const range = 5;

		const startPage = Math.max(currentPage - range, 1);
		const endPage = Math.min(currentPage + range, totalPages);

		for (let i = startPage; i <= endPage; i++) {
			if (i !== currentPage) {
				paginationLinks.push(
					<a
						href={`?page=${i}`}
						class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					>
						{i}
					</a>
				);
			} else {
				paginationLinks.push(
					<a
						href="#"
						aria-current="page"
						class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						{i}
					</a>
				);
			}
		}

		return paginationLinks;
	};

	const isFirstPage = currentPage === 1;
	const isLastPage = !nextPage;

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
					{routines.map(({ routine_id, description, date, is_completed }) => (
						<li class="flex justify-between gap-x-6 py-5 hover:bg-gray-100 cursor-pointer">
							<a
								href={!isFirstPage ? `/routines/${routine_id}` : "#"}
								class="flex flex-col min-w-0 flex-auto text-gray-900 hover:text-blue-600"
							>
								<p class="text-sm font-semibold">{description}</p>
								<p class="mt-1 text-xs text-gray-500">
									<time datetime={date}>{date}</time>
								</p>
								<p class="mt-1 text-xs text-gray-500">
									{is_completed ? "Completed" : "In Progress"}
								</p>
							</a>
						</li>
					))}
				</ul>

				<div class="flex justify-center pt-4">
					<nav
						class="isolate inline-flex -space-x-px rounded-md shadow-sm"
						aria-label="Pagination"
					>
						<a
							href={`?page=${currentPage - 1}`}
							class={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
								currentPage === 1 ? "cursor-not-allowed text-gray-300" : ""
							}`}
							aria-disabled={currentPage === 1}
							disabled={currentPage === 1}
						>
							<span class="sr-only">Previous</span>
							<svg
								class="size-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
						{renderPaginationLinks()}
						<a
							href={!isLastPage ? `?page=${nextPage}` : "#"}
							class={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
								!nextPage ? "cursor-not-allowed text-gray-300" : ""
							}`}
							aria-disabled={!nextPage}
							disabled={!nextPage}
						>
							<svg
								class="size-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</nav>
				</div>
			</div>
		</>
	);
}
