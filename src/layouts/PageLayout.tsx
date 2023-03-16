import React, { ReactNode, FC } from "react";

import Navbar from "../components/Navbar/Navbar";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="container-fluid">
      <Navbar />
      <div className="container">{children}</div>
    </div>
  );
};

export default PageLayout;
