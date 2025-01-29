import { FunctionComponent } from "preact";
import RedirectButton from "../(_islands)/RedirectButton.tsx";

type Props = {
  message: string;
  destinationUrl: string;
};

const SuccessMessage: FunctionComponent<Props> = (
  { message, destinationUrl },
) => {
  return (
    <div class="text-center">
      <svg
        class="mx-auto h-12 w-12 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        >
        </path>
      </svg>
      <p class="mt-4 text-lg font-semibold text-gray-800">
        {message}
      </p>
      <div class="mt-6">
        <RedirectButton
          text="Ok"
          destinationUrl={destinationUrl}
        />
      </div>
    </div>
  );
};

export default SuccessMessage;
