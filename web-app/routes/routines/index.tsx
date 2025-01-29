import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { get } from "../../api/ApiClient.ts";
import Navbar from "./(_components)/Navbar.tsx";
import AddButton from "../(_islands)/AddButton.tsx";
import BorderTable from "../(_islands)/BoderTable.tsx";
import BorderTableItem from "../(_islands)/BorderTableItem.tsx";

export type Routine = {
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
      const routinesUrl =
        `${baseUrl}/routines/1?page=${page}&pageSize=${pageSize}`;

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
    return <p class="text-center text-gray-700 mt-12 text-lg">{message}</p>;
  }

  const renderRoutines = () => {
    return routines.map(({ routine_id, description, date, is_completed }) => (
      <BorderTableItem key={routine_id}>
        <a href={`/routines/${routine_id}`} class="block">
          <p class="text-lg font-semibold text-gray-900">{description}</p>
          <p class="text-sm text-gray-500 mt-1">
            <time dateTime={date}>{date}</time>
          </p>
          <p
            class={`mt-1 text-sm font-medium ${
              is_completed ? "text-teal-600" : "text-orange-500"
            }`}
          >
            {is_completed ? "✔ Completed" : "⏳ In Progress"}
          </p>
        </a>
      </BorderTableItem>
    ));
  };

  const renderPaginationLinks = () => {
    const paginationLinks = [];
    const range = 2;
    const startPage = Math.max(currentPage - range, 1);
    const endPage = Math.min(currentPage + range, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      paginationLinks.push(
        <a
          href={`?page=${i}`}
          class={`px-4 py-2 mx-1 rounded-md font-medium transition-all ${
            i === currentPage
              ? "bg-slate-800 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </a>,
      );
    }

    return paginationLinks;
  };

  return (
    <div class="flex flex-col h-screen">
      <Navbar title="Routines">
        <AddButton to="/routines/new" />
      </Navbar>
      <BorderTable>
        {renderRoutines()}
      </BorderTable>
      <div class="py-4 bg-white shadow-md">
        <div class="flex justify-center">
          <nav class="flex items-center space-x-2">
            <a
              href={`?page=${currentPage - 1}`}
              class={`px-5 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-all ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-label="Previous page"
            >
              ←
            </a>
            {renderPaginationLinks()}
            <a
              href={nextPage ? `?page=${nextPage}` : "#"}
              class={`px-5 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-all ${
                !nextPage ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-label="Next page"
            >
              →
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
