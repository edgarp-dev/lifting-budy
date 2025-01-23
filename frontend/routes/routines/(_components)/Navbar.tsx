import { VNode } from "preact";
import { FunctionalComponent } from "preact";

type Props = {
	title: string;
	children?: VNode;
};
const Navbar: FunctionalComponent<Props> = ({ title, children }) => {
	return (
		<nav class="bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center">
			<h1 class="text-2xl font-bold text-white tracking-wide">{title}</h1>
			{children}
		</nav>
	);
};

export default Navbar;
