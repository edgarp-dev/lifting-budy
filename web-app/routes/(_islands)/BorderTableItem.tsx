import { ComponentChildren, FunctionComponent } from "preact";

type BorderTableItemProps = {
  key: string;
  children: ComponentChildren;
};

const BorderTableItem: FunctionComponent = ({ key, children }) => {
  return (
    <li
      key={key}
      class="p-4 border border-gray-300 rounded hover:bg-gray-100 transition-all cursor-pointer"
    >
      {children}
    </li>
  );
};

export default BorderTableItem;
