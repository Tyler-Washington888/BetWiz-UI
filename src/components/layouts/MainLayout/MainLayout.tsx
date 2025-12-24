import React, { ReactNode, useState, useEffect } from "react";
import NotAvailableMessage from "../../common/NotAvailableMessage";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowModal(window.innerWidth >= 1367);
    };

    
    checkScreenSize();

    
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="main-layout">
      {!showModal && <div className="main-container">{children}</div>}
      {showModal && <NotAvailableMessage />}
    </div>
  );
};

export default MainLayout;
