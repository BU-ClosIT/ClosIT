import { useUser } from "../providers/UserProvider";

export default function AddButton({ onClick }: { onClick: () => void }) {
  const user = useUser();

  const handleClick = () => {
    if (!user) return;
    onClick();
  };

  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded fixed bottom-15 right-4 shadow-lg z-50 hover:bg-blue-600"
      onClick={handleClick}
    >
      +
    </button>
  );
}
