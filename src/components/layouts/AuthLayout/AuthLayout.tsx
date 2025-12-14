import React, { ReactNode, useState, useEffect } from "react";
import NotAvailableMessage from "../../common/NotAvailableMessage";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
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
    <div className="auth-layout">
      {!showModal && <div className="auth-container">{children}</div>}
      {showModal && <NotAvailableMessage />}
    </div>
  );
};

export default AuthLayout;
