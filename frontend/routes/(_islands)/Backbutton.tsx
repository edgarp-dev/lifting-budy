const BackButton = () => {
	const goBack = () => {
		if (globalThis.window.history.length > 1) {
			globalThis.window.history.back();
		} else {
			globalThis.window.location.href = "/";
		}
	};

	return (
		<button
			onClick={goBack}
			class="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 text-sm"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="2"
				stroke="currentColor"
				class="w-4 h-4"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15.75 19.5L8.25 12l7.5-7.5"
				/>
			</svg>
			<span class="font-medium">Back</span>
		</button>
	);
};

export default BackButton;
