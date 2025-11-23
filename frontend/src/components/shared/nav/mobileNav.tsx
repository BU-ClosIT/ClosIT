import React, { useEffect } from "react";
import { useUser } from "../../providers/UserProvider";
import Link from "next/link";
import { PageName } from "@/src/model/PageName";
import Logo from "../Logo";
import Image from "next/image";

const MobileNav: React.FC<{ currentPage: PageName }> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useUser();

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <Logo />
      <button
        className="flex items-center gap-3 focus:outline-none h-10 w-10 transition-transform duration-200 hover:scale-110 rounded-md p-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((s) => !s)}
      >
        {isOpen ? (
          <Image
            src="/icons/Close.svg"
            alt="Close menu"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src="/icons/BurgerMenu.svg"
            alt="Open menu"
            width={24}
            height={24}
          />
        )}
      </button>

      <div
        className={`absolute top-15 right-0 w-50 bg-gray-200 transition-opacity duration-200 border-solid shadow-md rounded ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center justify-center h-full">
          <li className="py-2 border-b w-full text-center">
            <Link
              href={"/closet"}
              className={`hover:underline ${
                currentPage === "Profile" ? "font-bold" : ""
              }`}
            >
              {/* direct this to profile eventually */}
              Hello, {user?.name || "Guest"}
            </Link>
          </li>
          <li className="py-2 border-b border-gray-300 w-full text-center">
            <Link
              href="/dashboard"
              className={`hover:underline ${
                currentPage === "Dashboard" ? "font-bold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li className="py-2 border-b border-gray-300 w-full text-center">
            <Link
              href="/closet"
              className={`py-2 hover:underline ${
                currentPage === "Closet" ? "font-bold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Closet Management
            </Link>
          </li>
          <li className="py-2 border-b border-gray-300 w-full text-center">
            <Link
              href="/ai-chat"
              className={`py-2 hover:underline ${
                currentPage === "AI Chat" ? "font-bold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              AI Chat
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileNav;
