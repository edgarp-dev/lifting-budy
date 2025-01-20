const AddRoutineButton = () => {
	return (
		<button
			class="text-white bg-gray-800 hover:bg-gray-500 font-bold py-2 px-4 rounded mr-5"
			onClick={() => {
				location.href = "/routines/new";
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

export default AddRoutineButton;