interface Props {
	destinationUrl: string;
}

const OkButton = ({ destinationUrl }: Props) => {
	return (
		<button
			onClick={() => {
				location.href = destinationUrl
			}}
			class="bg-green-500 text-white font-semibold py-2 px-4 rounded-sm hover:bg-green-600"
		>
			Ok
		</button>
	);
};

export default OkButton;
