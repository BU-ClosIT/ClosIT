import React from "react";
import FullNav from "./fullNav";
import MobileNav from "./mobileNav";
import useIsMobile from "@/hooks/useIsMobile";

const Nav: React.FC = () => {
  const isMobile = useIsMobile(768);

  return <nav>{isMobile ? <MobileNav /> : <FullNav />}</nav>;
};

export default Nav;
