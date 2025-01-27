type Props = {
	destinationUrl: string;
	text: string;
};

const RedirectButton = ({ destinationUrl, text }: Props) => {
	return (
		<button
			onClick={() => {
				location.href = destinationUrl;
			}}
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
		>
			{text}
		</button>
	);
};

export default RedirectButton;
