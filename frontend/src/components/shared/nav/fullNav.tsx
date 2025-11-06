import Link from "next/link";
import { useUser } from "../../providers/UserProvider";
import CurrentWeather from "../../weather/CurrentWeather";

const FullNav: React.FC = () => {
  const user = useUser();

  return (
    <div className="flex flex-col items-center w-full">
      <ul className="flex gap-4 align-center justify-center mb-2">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/closet">Manage Closet</Link>{" "}
        </li>
        <li>
          <Link href="/ai-chat">AI Chat</Link>
        </li>
        <div>{user ? `Hello, ${user.name}` : "Hello, Guest"}</div>
      </ul>
      <CurrentWeather />
    </div>
  );
};
export default FullNav;
