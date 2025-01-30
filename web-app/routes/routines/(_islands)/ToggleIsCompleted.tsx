import { useEffect, useState } from "preact/hooks";
import { clientPut } from "../../../api/ApiClient.ts";

interface Props {
  isCompleted: boolean;
  routineId: string;
  userId: string;
  sessionToken: string;
}

const ToggleIsCompleted = ({
  isCompleted,
  routineId,
  userId,
  sessionToken,
}: Props) => {
  const [checked, setChecked] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checked === isCompleted) return;

    setLoading(true);

    const updateRoutineIsCompleted = async () => {
      const baseUrl = Deno.env.get("BASE_URL");
      const updateRoutineUrl = `${baseUrl}routines/${userId}/${routineId}`;
      await clientPut<{ id: number }>(updateRoutineUrl, sessionToken, {
        isCompleted: checked,
      });
    };

    updateRoutineIsCompleted();

    setLoading(false);
  }, [checked, isCompleted]);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <button
      onClick={handleChange}
      class={`relative w-12 h-6 flex items-center bg-gray-200 rounded-full transition-colors duration-300 ${
        checked ? "bg-slate-800" : ""
      }`}
      disabled={loading}
    >
      <span
        class={`absolute left-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      >
      </span>
    </button>
  );
};

export default ToggleIsCompleted;
