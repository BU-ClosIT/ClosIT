export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <input
      className="searchbar mb-2 p-2 w-full border border-gray-300 rounded"
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
