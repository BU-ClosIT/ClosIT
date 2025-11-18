export default function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="text-gray-600 hover:text-gray-800 hover:shadow border border-gray-300 rounded px-2 py-1"
      onClick={onClick}
    >
      &#10005;
    </button>
  );
}
