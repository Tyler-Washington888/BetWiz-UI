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
      setShowModal(window.innerWidth >= 1367);
    };

    
    checkScreenSize();

    
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
