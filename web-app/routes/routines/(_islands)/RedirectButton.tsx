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
			class="bg-slate-800 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-sm"
		>
			{text}
		</button>
	);
};

export default RedirectButton;
