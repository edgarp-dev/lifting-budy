import { ComponentChildren, FunctionComponent } from "preact";

type BorderTableProps = {
  children: ComponentChildren;
};

const BorderTable: FunctionComponent<BorderTableProps> = ({ children }) => {
  return (
    <div class="flex-1 overflow-y-auto container max-w-3xl mx-auto px-6 py-4">
      <ul role="list" class="space-y-2">
        {children}
      </ul>
    </div>
  );
};

export default BorderTable;
