import { FunctionalComponent } from "preact";
import { Routine } from "../routines/index.tsx";
import { addBreadcrumb } from "./Breadcrumb.tsx";

type RoutineListItemProps = {
	routine: Routine;
};

const RoutineListItem: FunctionalComponent<RoutineListItemProps> = ({
	routine,
}) => {
	const { routine_id, description, date, is_completed } = routine;
	return (
		<a
			href={`/routines/${routine_id}`}
			class="flex flex-col min-w-0 flex-auto text-gray-900 hover:text-blue-600"
			onClick={() => {
				addBreadcrumb(description, `/routines/${routine_id}`);
			}}
		>
			<p class="text-sm font-semibold">{description}</p>
			<p class="mt-1 text-xs text-gray-500">
				<time datetime={date}>{date}</time>
			</p>
			<p class="mt-1 text-xs text-gray-500">
				{is_completed ? "Completed" : "In Progress"}
			</p>
		</a>
	);
};

export default RoutineListItem;
