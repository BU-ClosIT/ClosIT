import React from "react";
import FullNav from "./fullNav";
import MobileNav from "./mobileNav";
import useIsMobile from "@/src/hooks/useIsMobile";

const Nav: React.FC = () => {
  const isMobile = useIsMobile(768);

  return (
    <nav className="flex flex-row justify-between items-center p-4 border-b">
      {isMobile ? <MobileNav /> : <FullNav />}
    </nav>
  );
};

export default Nav;
