import { useState } from "preact/hooks";

type Props = {
  text: string;
  showLoader?: boolean;
  formId: string;
};

const FormButtonWithLoader = ({ text, showLoader, formId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = (e: Event) => {
    e.preventDefault();

    setIsLoading(true);

    const formElement = document.getElementById(formId) as HTMLFormElement;
    formElement?.submit();
  };

  return (
    <button
      type="submit"
      disabled={isLoading ?? showLoader}
      class={`w-full text-white font-semibold py-2 px-4 rounded transition-all ${
        isLoading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-slate-800 hover:bg-gray-500"
      }`}
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
};

export default FormButtonWithLoader;
