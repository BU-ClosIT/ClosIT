export default function EditButtons({
  isEditing,
  setIsEditing,
  handleSave,
  handleRevert,
  handleDelete,
}: {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => void;
  handleRevert: () => void;
  handleDelete: () => void;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-1">
      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        className="edit-save-btn mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isEditing ? "Save" : "Edit"}
      </button>
      {isEditing && (
        <button
          onClick={handleRevert}
          className="ml-2 mb-4 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Revert
        </button>
      )}
      {isEditing && (
        <button
          onClick={handleDelete}
          className="ml-2 mb-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      )}
    </div>
  );
}
