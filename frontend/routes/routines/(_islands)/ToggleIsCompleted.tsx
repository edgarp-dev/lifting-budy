import { useEffect, useState } from "preact/hooks";
import { clientPut } from "../../../api/ApiClient.ts";

interface Props {
	isCompleted: boolean;
	routineId: string;
	userId: string;
	sessionToken: string;
}

const ToggleIsCompleted = ({
	isCompleted,
	routineId,
	userId,
	sessionToken,
}: Props) => {
	const [checked, setChecked] = useState(isCompleted);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (checked === isCompleted) return;

		setLoading(true);

		const updateRoutineIsCompleted = async () => {
			const updateRoutineUrl = `https://mdy2rbcypyehddeuvi2s55k56i0mkqtm.lambda-url.us-east-1.on.aws/routines/${userId}/${routineId}`;
			await clientPut<{ id: number }>(updateRoutineUrl, sessionToken, {
				isCompleted: checked,
			});
		};

		updateRoutineIsCompleted();

		setLoading(false);
	}, [checked, isCompleted]);

	const handleChange = () => {
		setChecked(!checked);
	};

	return (
		<div class="flex items-center">
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					class="sr-only"
					checked={checked}
					onChange={handleChange}
					disabled={loading}
				/>
				<div
					class={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 ${
						checked ? "peer-checked:bg-blue-600" : ""
					}`}
				></div>
				<span
					class={`ml-3 text-sm font-medium ${
						checked ? "text-green-600" : "text-gray-600"
					}`}
				>
					{checked ? "Completed" : "In Progress"}
				</span>
			</label>
			{loading && <span class="ml-2 text-gray-500 text-sm">Saving...</span>}
		</div>
	);
};

export default ToggleIsCompleted;
