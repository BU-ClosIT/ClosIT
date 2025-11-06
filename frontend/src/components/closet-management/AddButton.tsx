import { useUser } from "../providers/UserProvider";

export default function AddButton() {
  const user = useUser();

  const handleClick = () => {
    if (!user) return;
    // Logic to add item to closet
  };

  return <button onClick={handleClick}>Add Item</button>;
}
