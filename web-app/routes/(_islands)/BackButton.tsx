import { FunctionComponent } from "preact";

interface BackButtonProps {
  href: string;
  label?: string;
}

const BackButton: FunctionComponent<BackButtonProps> = ({
  href,
  label = "Back",
}: BackButtonProps) => {
  return (
    <a
      href={href}
      class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded"
    >
      <svg
        class="w-5 h-5 mr-2 text-slate-800"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        >
        </path>
      </svg>
      <span class="text-black font-medium">{label}</span>
    </a>
  );
};

export default BackButton;
