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
      // Show modal for screens larger than largest iPad (1366px)
      setShowModal(window.innerWidth > 1366);
    };

    // Check on mount
    checkScreenSize();

    // Check on resize
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
