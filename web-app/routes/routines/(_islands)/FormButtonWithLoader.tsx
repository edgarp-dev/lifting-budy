import { useState } from "preact/hooks";

type Props = {
	text: string;
	showLoader?: boolean;
	formId: string;
};

const FormButtonWithLoader = ({ text, showLoader, formId }: Props) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleOnClick = (e: Event) => {
		e.preventDefault();

		setIsLoading(true);

		const formElement = document.getElementById(formId) as HTMLFormElement;
		formElement?.submit();
	};

	return (
		<button
			type="submit"
			disabled={isLoading ?? showLoader}
			class={`w-full py-2 px-4 text-white font-semibold rounded-md shadow ${
				isLoading
					? "bg-gray-400 cursor-not-allowed"
					: "bg-blue-500 hover:bg-blue-600"
			}`}
			onClick={handleOnClick}
		>
			{text}
		</button>
	);
};

export default FormButtonWithLoader;
