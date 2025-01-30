import { ComponentChildren, FunctionComponent } from "preact";

type BorderTableItemProps = {
  key: string | number;
  children: ComponentChildren;
  isClickable?: boolean;
};

const BorderTableItem: FunctionComponent<BorderTableItemProps> = (
  { key, children, isClickable = true },
) => {
  return (
    <li
      key={key}
      class={`p-4 border border-gray-300 rounded hover:bg-gray-100 transition-all ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      {children}
    </li>
  );
};

export default BorderTableItem;
