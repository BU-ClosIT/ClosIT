import React from "react";
import FullNav from "./fullNav";
import MobileNav from "./mobileNav";
import useIsMobile from "../../../hooks/useIsMobile";
import { PageName } from "../../../model/PageName";

const Nav: React.FC<{ currentPage: PageName }> = ({ currentPage }) => {
  const isMobile = useIsMobile(768);

  return (
    <nav className="flex flex-row justify-between items-center p-4 border-b">
      {isMobile ? (
        <MobileNav currentPage={currentPage} />
      ) : (
        <FullNav currentPage={currentPage} />
      )}
    </nav>
  );
};

export default Nav;
