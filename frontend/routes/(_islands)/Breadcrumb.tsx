import { FunctionalComponent } from "preact";
import { signal } from "@preact/signals";

type BreadcrumbItem = {
	label: string;
	href?: string;
};
const initialState: BreadcrumbItem[] = [
	{ label: "Routines", href: "/routines" },
];
const breadcrumb = signal(initialState);

const addBreadcrumb = (label: string, href: string) => {
	breadcrumb.value = [...breadcrumb.value, { label, href }];
};

const Breadcrumb: FunctionalComponent = () => {
	return (
		<nav class="bg-gray-100 p-3 rounded-lg flex items-center">
			<ul class="flex items-center space-x-2 text-gray-600 text-sm">
				{breadcrumb.value.map((item, index) => {
					const isFirstItem = index === 0;
					return (
						<li key={index} class="flex items-center">
							{!isFirstItem && <span class="mx-1">›</span>}
							{item.href ? (
								<a href={item.href} class="text-gray-700 hover:text-gray-900">
									{item.label}
								</a>
							) : (
								<span class="text-blue-600 font-medium">{item.label}</span>
							)}
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export { Breadcrumb, addBreadcrumb };
