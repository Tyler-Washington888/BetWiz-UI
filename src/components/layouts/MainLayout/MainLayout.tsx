import React, { ReactNode } from "react";
import NotAvailableMessage from "../../common/NotAvailableMessage";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="main-container">{children}</div>
      <div className="desktop-not-available">
        <NotAvailableMessage />
      </div>
    </div>
  );
};

export default MainLayout;
