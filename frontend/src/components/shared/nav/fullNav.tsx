import Link from "next/link";
import { useUser } from "../../providers/UserProvider";
import CurrentWeather from "../../weather/CurrentWeather";
import { PageName } from "@/src/model/PageName";
import Logo from "../Logo";

const FullNav: React.FC<{ currentPage: PageName }> = ({ currentPage }) => {
  const user = useUser();

  return (
    <div className="flex flex-col items-center w-full">
      <Logo />
      <ul className="flex gap-4 align-center justify-center mb-2">
        <li className="border-b-2 border-transparent hover:border-gray-500">
          <Link
            href="/dashboard"
            className={currentPage === "Dashboard" ? "font-bold" : ""}
            data-testid="cypress-nav-dashboard-link"
          >
            Dashboard
          </Link>
        </li>
        <li className="border-b-2 border-transparent hover:border-gray-500">
          <Link
            href="/closet"
            className={currentPage === "Closet" ? "font-bold" : ""}
            data-testid="cypress-nav-closet-link"
          >
            Manage Closet
          </Link>
        </li>
        <li className="border-b-2 border-transparent hover:border-gray-500">
          <Link
            href="/ai-chat"
            className={currentPage === "AI Chat" ? "font-bold" : ""}
          >
            AI Chat
          </Link>
        </li>
        <div>{user ? `Hello, ${user.name}` : "Hello, Guest"}</div>
      </ul>
      <CurrentWeather />
    </div>
  );
};
export default FullNav;
