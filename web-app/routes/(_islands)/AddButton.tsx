import { FunctionComponent } from "preact";

interface AddButtonProps {
	to: string;
}

const AddButton: FunctionComponent<AddButtonProps> = ({ to }) => {
	return (
		<button
			class="text-white bg-gray-800 hover:bg-gray-500 font-bold rounded-sm mr-5 cursor-pointer"
			onClick={() => {
				location.href = to;
			}}
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M12 4v16m8-8H4"
				></path>
			</svg>
		</button>
	);
};

export default AddButton;
